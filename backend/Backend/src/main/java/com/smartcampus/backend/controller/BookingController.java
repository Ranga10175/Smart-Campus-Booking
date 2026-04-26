package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.BookingRequest;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable String userId) {
        return bookingService.getBookingsByUser(userId);
    }

    @PutMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable String id) {
        return bookingService.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable String id, @RequestBody Map<String, String> body) {
        return bookingService.rejectBooking(id, body.get("reason"));
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable String id) {
        return bookingService.cancelBooking(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
    }
}