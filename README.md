# Library Management System

The **Library Management System** is an interactive application designed to manage core library operations, including member registration, book inventory management, lending, and book returns. The system provides a clean, intuitive interface with clearly separated views for members, books, and administrative tasks.

This project demonstrates practical software design concepts such as Model–View–Controller (MVC) architecture, the subscriber pattern, and multi-view state management within a real-world domain.

---

## Features

- Member management (add, view, and track borrowed books)
- Book inventory management with availability tracking
- Lending books to members with validation
- Returning books with automatic state updates
- Multiple coordinated views with real-time updates
- Color-coded interface sections for clarity and usability
- Pre-populated example data for demonstration

---

## Technologies Used

- TypeScript / JavaScript
- SimpleKit (UI framework)
- HTML / CSS
- MVC architecture
- Subscriber / Observer pattern

---

## Application Architecture

The application follows the **Model–View–Controller (MVC)** pattern:

### Model
- Manages members, books, and borrowing relationships
- Enforces business rules (e.g., preventing lending unavailable books)

### View
- Members list view
- Member detail view
- Books list view
- Administrative view for managing system operations

### Controller
- Handles user input
- Coordinates updates between views and models

All views subscribe to model changes, ensuring consistent and automatic updates across the application.

---

## Domain Objects

### Member
- Unique ID and name
- Tracks currently borrowed books
- Updates automatically on lending and return actions

### Book
- Unique ID, title, and available copy count
- Tracks availability and current borrowers

### Borrow Relationship
- Represents the lending relationship between members and books
- Enforced through system validation logic

Example domain objects are preloaded for demonstration purposes.

---

## Third-Party Libraries

This project uses **SimpleKit**, an external UI framework.

- SimpleKit is **not authored by me**
- It is used according to its original license
- No SimpleKit source code is redistributed in this repository

Please refer to the official SimpleKit repository for license and usage details.

---

## Academic Context

This project was originally developed as part of a university course.

It is shared publicly **for educational and portfolio purposes only**.

> **Academic Integrity Notice**  
> If you are currently enrolled in a similar course, do not copy or submit this code as your own work.

---

## Limitations

- Application state is not persisted between sessions
- Data resets to its initial state on restart
- Designed for demonstration and learning purposes rather than production use

---

## Future Improvements

- Search and filtering for members and books
- Scrollable views for large datasets
- Alternative layouts (card view vs list view)
- Persistent storage (database or local storage)
- Accessibility enhancements (keyboard navigation, ARIA labels)

---

## License

This repository contains original work authored by **Md Ataullah Bahari** and is licensed under the **MIT License**.

Third-party libraries remain under their respective licenses and are not covered by this license.

See the `LICENSE` file for full details.

---

## Author

**Md Ataullah Bahari**  
Computer Science Student  
Academic & Portfolio Project
