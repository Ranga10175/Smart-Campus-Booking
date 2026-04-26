package com.smartcampus.backend.ticketing.controller;
import com.smartcampus.backend.ticketing.dto.*;
import com.smartcampus.backend.ticketing.model.*;
import com.smartcampus.backend.ticketing.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
@RestController @RequestMapping("/api/tickets") @CrossOrigin(origins = "*")
public class TicketController {
  private final TicketService ticketService;
  public TicketController(TicketService ticketService) { this.ticketService = ticketService; }
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Ticket> createTicket(@RequestPart("resourceLocation") String resourceLocation,@RequestPart("category") String category,@RequestPart("description") String description,@RequestPart("priority") String priority,@RequestPart("contactDetails") String contactDetails,@RequestPart(value="images", required=false) List<MultipartFile> images) {
    TicketCreateDto dto = new TicketCreateDto(); dto.setResourceLocation(resourceLocation); dto.setCategory(category); dto.setDescription(description); dto.setPriority(Ticket.Priority.valueOf(priority.toUpperCase())); dto.setContactDetails(contactDetails); return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(dto, images));
  }
  @GetMapping("/my") public ResponseEntity<List<Ticket>> getMyTickets() { return ResponseEntity.ok(ticketService.getMyTickets()); }
  @PutMapping("/{id}") public ResponseEntity<Ticket> updateTicket(@PathVariable String id,@Valid @RequestBody TicketUpdateDto dto) { return ResponseEntity.ok(ticketService.updateMyTicket(id, dto)); }
  @DeleteMapping("/{id}") public ResponseEntity<Void> deleteTicket(@PathVariable String id) { ticketService.deleteMyTicket(id); return ResponseEntity.noContent().build(); }
  @GetMapping("/{id}") public ResponseEntity<Ticket> getTicketById(@PathVariable String id) { return ResponseEntity.ok(ticketService.getTicketById(id)); }
  @GetMapping("/assigned") public ResponseEntity<List<Ticket>> getAssignedTickets() { return ResponseEntity.ok(ticketService.getAssignedTickets()); }
  @PatchMapping("/{id}/progress") public ResponseEntity<Ticket> updateProgress(@PathVariable String id,@Valid @RequestBody ProgressDto dto) { return ResponseEntity.ok(ticketService.updateProgress(id, dto)); }
  @PatchMapping("/{id}/resolution") public ResponseEntity<Ticket> saveResolutionNotes(@PathVariable String id,@RequestBody ResolutionDto dto) { return ResponseEntity.ok(ticketService.saveResolutionNotes(id, dto)); }
  @PatchMapping("/{id}/status") public ResponseEntity<Ticket> changeStatus(@PathVariable String id,@Valid @RequestBody StatusDto dto) { return ResponseEntity.ok(ticketService.changeStatus(id, dto)); }
  @GetMapping public ResponseEntity<List<Ticket>> getAllTickets(@RequestParam(required=false) String status,@RequestParam(required=false) String priority,@RequestParam(required=false) String category,@RequestParam(required=false) String dateRange) { return ResponseEntity.ok(ticketService.getAllTickets(status, priority, category, dateRange)); }
  @PatchMapping("/{id}/assign") public ResponseEntity<Ticket> assignTechnician(@PathVariable String id,@Valid @RequestBody AssignDto dto) { return ResponseEntity.ok(ticketService.assignTechnician(id, dto)); }
  @PatchMapping("/{id}/reject") public ResponseEntity<Ticket> rejectTicket(@PathVariable String id,@RequestBody RejectDto dto) { return ResponseEntity.ok(ticketService.rejectTicket(id, dto)); }
  @PostMapping("/{id}/comments") public ResponseEntity<TicketComment> addComment(@PathVariable String id,@Valid @RequestBody CommentDto dto) { return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.addComment(id, dto)); }
}
