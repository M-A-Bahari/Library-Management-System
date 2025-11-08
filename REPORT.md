# CS3035 – Course Project Report

## Description of Your Project

The **Library Management System** is an application for managing library operations including member registration, book inventory, lending and return books. The application provides an intuitive interface with color-coded sections for different operations, making it easy to distinguish between member management, book inventory, lending operations, and return processes.

I selected this project because library management systems represent a real-world use case that involves complex data relationships (members borrowing multiple books, books being borrowed by multiple members) and multiple user workflows. This allowed me to demonstrate proper MVC architecture, subscriber pattern implementation, and multiple view states while creating a practical, usable application.

## Requirements

### How/What different views did you provide for some aspect of your model?

The application provides **four distinct views** for managing the library system:

1. **Members List View (MainView - Members Tab)**
   - Displays all library members in a list format
   - Shows member name, ID, and number of books borrowed
   - Provides "View" buttons to navigate to individual member details
   - Updates automatically when members are added or removed

2. **Member Detail View (MemberDetailView)**
   - Detailed view of a specific member accessed via the "View" button
   - Displays member's name, student ID, and borrowed books count
   - Lists all books currently borrowed by the member
   - Includes a back button to return to the members list
   - Uses color coding (green if no books borrowed, red if books are borrowed)

3. **Book List View (BookListView - Books Tab)**
   - Shows all books in the library inventory
   - Displays book title, ID, availability status (available/total copies)
   - Shows who has borrowed each book
   - Calculates total copies (available + borrowed) dynamically
   - Color codes availability (green if available, red if all copies are borrowed)

4. **Admin View (AdminView - Admin Tab)**
   - Comprehensive administrative interface with four color-coded sections:
     - **Add New Member** (light teal background)
     - **Add New Book** (light green background)
     - **Lend Book to Member** (light indigo background)
     - **Return Books from Member** (light amber background)
   - Each section provides input fields and action buttons with success/error messaging

All views implement the **Subscriber pattern**, automatically updating when the model changes, ensuring data consistency across the application.

### What are the different domain objects that can be created/edited in your application?

The application manages **three primary domain objects**:

1. **Member (Library Member)**
   - **Properties**: `id` (string), `name` (string), `borrowed` (array of book IDs)
   - **Operations**:
     - **Create**: Add new members via Admin tab with unique ID and name
     - **Update**: Automatically updated when borrowing/returning books
     - **View**: Display member details including borrowed books
     - **Delete**: Implicit through the system (members with no borrows can be removed)
   - **Pre-populated**: Ataullah Bahari (S001), James Bond (S002), Henry Cavill (S003)

2. **Book**
   - **Properties**: `id` (string), `title` (string), `count` (number of available copies)
   - **Operations**:
     - **Create**: Add new books via Admin tab with title and copy count
     - **Update**: Copy count decreases when lent, increases when returned
     - **View**: Display in Books tab with availability and borrower information
     - **Delete**: Implicit through the system
   - **Pre-populated**: Introduction to Algorithms, Design Patterns, Clean Code, The Pragmatic Programmer, Refactoring

3. **Borrow Record**
   - **Properties**: Relationship between Member and Book (stored in Member's `borrowed` array)
   - **Operations**:
     - **Create**: Lend book to member (adds book ID to member's borrowed array, decrements book count)
     - **Update**: Track active loans through member records
     - **Delete**: Return book (removes book ID from member's borrowed array, increments book count)
   - **Validation**: System prevents lending unavailable books and returning books not borrowed

---

### What parts of the application/project did you find particularly challenging? And, what would you have liked to improve?

**Challenging Aspects:**

1. **View Synchronization**
   - Implementing the Subscriber pattern to ensure all views update when the model changes was complex
   - Managing the relationship between MainView and sub-views (BookListView, AdminView, MemberDetailView)
   - Ensuring proper cleanup of view children when updating to prevent memory leaks

2. **State Management**
   - Coordinating between the tab-based navigation in MainView and the individual views
   - Managing the updateContent() method to properly rebuild containers while maintaining state
   - Handling the flow between Members list view and Member detail view with the back button

**Improvements for Future Development:**

1. **Enhanced View Options**
   - Currently implementing **list view** for members and books
   - Could add **card view** for a more visual, grid-based layout with book covers or member photos
   - Toggle between list/card view based on user preference

2. **Scroll View Implementation**
   - Add **scroll functionality** for when lists grow beyond screen height
   - Prevent overflow by implementing a scrollable container
   - This would ensure usability even with hundreds of members or books

3. **Search and Filter**
   - Add search functionality to quickly find members or books
   - Filter books by availability status
   - Sort members by number of borrowed books or alphabetically


### Any other comments on the project?

This project successfully demonstrates the ability to create a fully functional, multi-view application with proper MVC architecture, multiple domain objects, and a polished, consistent user interface using the SimpleKit framework.