package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.BookingRequest;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
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

        return bookingRepository.save(booking);
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
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    private boolean isOverlapping(String start1, String end1,
                                  String start2, String end2) {
        return start1.compareTo(end2) < 0 &&
               end1.compareTo(start2) > 0;
    }
}