# ShareWhere - A Location Sharing Web Application

[sharewheresocial.com](https://sharewheresocial.com)

ShareWhere is a web application that allows users to discover, share, and save interesting locations. Built with a modern tech stack, ShareWhere provides a seamless experience for users to explore and contribute to a community-driven map of unique places. The application can be used to find new points of interest near the user in their home town or anywhere in the world.

## Technologies Used

* **Backend:**
    * Spring Boot: For building a robust and scalable RESTful API.
    * Maven: For project management and dependency handling.
    * Microsoft Azure: For database services and blob storage for image management.
    * AWS EC2: For hosting the backend application.
    * AWS Load Balancer: For distributing traffic to the backend.
    * Docker: For containerizing the backend application.
* **Frontend:**
    * React: For creating a dynamic and responsive user interface.
    * AWS S3: For hosting the frontend.
    * AWS CloudFront: For CDN services.
* **Infrastructure:**
    * Microsoft Azure: Database and Blob Storage
    * AWS: EC2, Load Balancer, S3, CloudFront.

## Sections

### Home Page

The home page of ShareWhere provides a quick overview of featured locations and a search bar to find specific places. 

![sharewhere-homepage](https://github.com/user-attachments/assets/b0add2e9-ddd5-4589-be00-7fab348c77f0)

![sharewhere-homepage-search](https://github.com/user-attachments/assets/1f604dc8-9082-4944-8614-1c530d5f58af)

**How to Use:**

* **Search:** Search for users by name or username and locations by their location name.
* **Featured Locations:** Browse the featured locations displayed in sections sorted by different attributes of the location. These locations will be within 30 miles of the user's current location. The home page will be accessible to all visitors, but will include a following section when logged in that contains posts from other users that the user follows.
* **Navigation:** Use the navigation bar to access other sections of the application.

### Discover Page

The discover page displays a map with all locations on it, allowing users to explore and filter places based on various criteria. This page is accessible to all website visitors.

![sharewhere-discover](https://github.com/user-attachments/assets/09087ab0-9810-47fa-bb8e-59808142fe45)

**How to Use:**

* **Map Exploration:** Pan and zoom the map to explore different areas across the world.
* **Filters:** Use the filter options to narrow down locations based on tags, pin types, or location name.
* **Location Details:** Click on a location marker to view detailed information about the place.

### Add Location Page

The add location page enables users to contribute to the ShareWhere community by adding new locations.

![sharewhere-updated](https://github.com/user-attachments/assets/384d415f-9838-4d72-8858-3a8dabd06066)

**How to Use:**

* **Location Details:** Fill in the required information, including location name, description, tags, pin type, images, and coordinates. The coordinates will be acquired when the user places a pin on the map directly over the location that they are sharing.
* **Image Upload:** Upload up to 5 images of the location using the provided file upload functionality that uses Azure blob storage.
* **Tagging:** Add relevant tags to categorize the location.
* **Pin Type:** Choose an image from the provided options to display on the pin when it is added to the map. This will allow users to see what kind of locations are in their area without needing to click on each pin.
* **Submission:** Submit the location for review and approval.

### Profile Section

The profile section allows users to manage their saved locations, view their contributions, and update their profile information.

![sharewhere-profile](https://github.com/user-attachments/assets/e8601940-08d3-46ad-b1db-062632271450)

**How to Use:**

* **Saved Locations:** View a list of saved locations.
* **Contributions:** See a list of locations added by the user.
* **Profile Settings:** Update profile information, such as username, name, bio, and profile picture.
