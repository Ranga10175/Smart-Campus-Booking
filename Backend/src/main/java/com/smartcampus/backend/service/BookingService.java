package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.BookingRequest;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final List<Booking> fallbackBookings = new CopyOnWriteArrayList<>();
    private volatile boolean useFallbackStorage = false;

    public BookingService(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    public Booking createBooking(BookingRequest request) {

        List<Booking> bookings = findBookingsByResourceAndDate(
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

        Booking savedBooking = saveBooking(booking);
        notificationService.createBookingCreatedNotifications(savedBooking);
        return savedBooking;
    }

    public List<Booking> getAllBookings() {
        if (useFallbackStorage) {
            return fallbackBookings.stream()
                    .sorted(Comparator.comparing(Booking::getDate, Comparator.nullsLast(String::compareTo)).reversed()
                            .thenComparing(Booking::getStartTime, Comparator.nullsLast(String::compareTo)).reversed())
                    .toList();
        }

        try {
            return bookingRepository.findAll();
        } catch (RuntimeException ex) {
            enableFallback("load all bookings", ex);
            return getAllBookings();
        }
    }

    public List<Booking> getBookingsByUser(String userId) {
        if (useFallbackStorage) {
            return fallbackBookings.stream()
                    .filter(booking -> userId.equals(booking.getUserId()))
                    .sorted(Comparator.comparing(Booking::getDate, Comparator.nullsLast(String::compareTo)).reversed()
                            .thenComparing(Booking::getStartTime, Comparator.nullsLast(String::compareTo)).reversed())
                    .toList();
        }

        try {
            return bookingRepository.findByUserId(userId);
        } catch (RuntimeException ex) {
            enableFallback("load user bookings", ex);
            return getBookingsByUser(userId);
        }
    }

    public Booking approveBooking(String id) {
        Booking booking = findBookingById(id);

        booking.setStatus("APPROVED");
        booking.setRejectionReason(null);
        Booking savedBooking = saveBooking(booking);
        notificationService.createBookingApprovedNotifications(savedBooking);
        return savedBooking;
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = findBookingById(id);

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        Booking savedBooking = saveBooking(booking);
        notificationService.createBookingRejectedNotifications(savedBooking);
        return savedBooking;
    }

    public Booking cancelBooking(String id) {
        Booking booking = findBookingById(id);

        booking.setStatus("CANCELLED");
        Booking savedBooking = saveBooking(booking);
        notificationService.createBookingCancelledNotifications(savedBooking);
        return savedBooking;
    }

    public void deleteBooking(String id) {
        Booking booking = findBookingById(id);

        if (useFallbackStorage) {
            fallbackBookings.removeIf(existing -> id.equals(existing.getId()));
            notificationService.createBookingDeletedNotifications(booking);
            return;
        }

        try {
            bookingRepository.deleteById(id);
            notificationService.createBookingDeletedNotifications(booking);
        } catch (RuntimeException ex) {
            enableFallback("delete booking", ex);
            deleteBooking(id);
        }
    }

    private boolean isOverlapping(String start1, String end1,
                                  String start2, String end2) {
        return start1.compareTo(end2) < 0 &&
               end1.compareTo(start2) > 0;
    }

    private List<Booking> findBookingsByResourceAndDate(String resourceId, String date) {
        if (useFallbackStorage) {
            return fallbackBookings.stream()
                    .filter(booking -> resourceId.equals(booking.getResourceId()) && date.equals(booking.getDate()))
                    .toList();
        }

        try {
            return bookingRepository.findByResourceIdAndDate(resourceId, date);
        } catch (RuntimeException ex) {
            enableFallback("load bookings by resource/date", ex);
            return findBookingsByResourceAndDate(resourceId, date);
        }
    }

    private Booking findBookingById(String id) {
        if (useFallbackStorage) {
            return fallbackBookings.stream()
                    .filter(booking -> id.equals(booking.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
        }

        try {
            return bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
        } catch (RuntimeException ex) {
            enableFallback("load booking by id", ex);
            return findBookingById(id);
        }
    }

    private Booking saveBooking(Booking booking) {
        if (useFallbackStorage) {
            return saveBookingInFallback(booking);
        }

        try {
            return bookingRepository.save(booking);
        } catch (RuntimeException ex) {
            enableFallback("save booking", ex);
            return saveBookingInFallback(booking);
        }
    }

    private Booking saveBookingInFallback(Booking booking) {
        if (booking.getId() == null || booking.getId().isBlank()) {
            booking.setId(UUID.randomUUID().toString());
        }

        fallbackBookings.removeIf(existing -> booking.getId().equals(existing.getId()));
        fallbackBookings.add(booking);
        return booking;
    }

    private void enableFallback(String action, RuntimeException ex) {
        if (!useFallbackStorage) {
            logger.warn("Switching bookings to in-memory fallback because MongoDB failed during {}: {}", action, ex.getMessage());
            useFallbackStorage = true;
        }
    }
}
