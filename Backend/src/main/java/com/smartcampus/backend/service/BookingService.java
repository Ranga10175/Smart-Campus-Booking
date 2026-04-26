package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.BookingRequest;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    public Booking createBooking(BookingRequest request) {

        List<Booking> bookings =
                bookingRepository.findByResourceIdAndDate(
                        request.getResourceId(),
                        request.getDate()
                );

        for (Booking existing : bookings) {
            if ("APPROVED".equals(existing.getStatus()) ||
                "PENDING".equals(existing.getStatus())) {

                if (isOverlapping(
                        request.getStartTime(),
                        request.getEndTime(),
                        existing.getStartTime(),
                        existing.getEndTime()
                )) {
                    throw new RuntimeException("Booking conflict: time already taken");
                }
            }
        }

        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setResourceName(request.getResourceName());
        booking.setUserId(request.getUserId());
        booking.setUserName(request.getUserName());
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus("PENDING");

        Booking saved = bookingRepository.save(booking);

        String adminTitle = "New booking request";
        String adminMsg = request.getUserName() + " requested " + request.getResourceName() +
                " on " + request.getDate() + " (" + request.getStartTime() + " - " + request.getEndTime() + ").";
        notificationService.createAdminNotification("BOOKING_CREATED", adminTitle, adminMsg, saved.getId());

        String studentTitle = "Booking request submitted";
        String studentMsg = "Your request for " + request.getResourceName() + " on " + request.getDate() +
                " (" + request.getStartTime() + " - " + request.getEndTime() + ") is pending approval.";
        notificationService.createStudentNotification(request.getUserId(), "BOOKING_CREATED", studentTitle, studentMsg, saved.getId());

        return saved;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking approveBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("APPROVED");
        Booking saved = bookingRepository.save(booking);

        String studentTitle = "Booking approved";
        String studentMsg = "Your booking for " + booking.getResourceName() + " on " + booking.getDate() +
                " (" + booking.getStartTime() + " - " + booking.getEndTime() + ") has been approved.";
        notificationService.createStudentNotification(booking.getUserId(), "BOOKING_APPROVED", studentTitle, studentMsg, saved.getId());

        String adminTitle = "Booking approved";
        String adminMsg = "Approved booking request from " + booking.getUserName() + " for " + booking.getResourceName() + ".";
        notificationService.createAdminNotification("BOOKING_APPROVED", adminTitle, adminMsg, saved.getId());

        return saved;
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        Booking saved = bookingRepository.save(booking);

        String studentTitle = "Booking rejected";
        String studentMsg = "Your booking for " + booking.getResourceName() + " on " + booking.getDate() +
                " (" + booking.getStartTime() + " - " + booking.getEndTime() + ") was rejected." +
                (reason == null || reason.isBlank() ? "" : " Reason: " + reason);
        notificationService.createStudentNotification(booking.getUserId(), "BOOKING_REJECTED", studentTitle, studentMsg, saved.getId(), "/create-booking");

        String adminTitle = "Booking rejected";
        String adminMsg = "Rejected booking request from " + booking.getUserName() + " for " + booking.getResourceName() + ".";
        notificationService.createAdminNotification("BOOKING_REJECTED", adminTitle, adminMsg, saved.getId());

        return saved;
    }

    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        Booking saved = bookingRepository.save(booking);

        String studentTitle = "Booking cancelled";
        String studentMsg = "Your booking for " + booking.getResourceName() + " on " + booking.getDate() +
                " (" + booking.getStartTime() + " - " + booking.getEndTime() + ") has been cancelled.";
        notificationService.createStudentNotification(booking.getUserId(), "BOOKING_CANCELLED", studentTitle, studentMsg, saved.getId());

        String adminTitle = "Booking cancelled";
        String adminMsg = booking.getUserName() + " cancelled a booking for " + booking.getResourceName() + ".";
        notificationService.createAdminNotification("BOOKING_CANCELLED", adminTitle, adminMsg, saved.getId());

        return saved;
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    private boolean isOverlapping(String start1, String end1,
                                  String start2, String end2) {
        LocalTime s1 = parseTime(start1);
        LocalTime e1 = parseTime(end1);
        LocalTime s2 = parseTime(start2);
        LocalTime e2 = parseTime(end2);

        if (!e1.isAfter(s1)) {
            throw new RuntimeException("End time must be after start time");
        }
        if (!e2.isAfter(s2)) {
            // Existing data might be invalid; treat as overlapping to be safe.
            return true;
        }

        return s1.isBefore(e2) && e1.isAfter(s2);
    }

    private LocalTime parseTime(String value) {
        if (value == null || value.isBlank()) {
            throw new RuntimeException("Invalid time value");
        }
        try {
            // Accepts both 08:00 and 8:00
            return LocalTime.parse(value.trim(), DateTimeFormatter.ofPattern("H:mm"));
        } catch (DateTimeParseException ex) {
            throw new RuntimeException("Invalid time format. Expected HH:mm");
        }
    }
}