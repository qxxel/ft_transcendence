# ft_transcendence

*This project has been created as part of the 42 curriculum by agerbaud, kiparis, mcurto, mreynaud*

![42 Project](https://img.shields.io/badge/42-Project-black)
![Language](https://img.shields.io/badge/TypeScript-gray?logo=typescript)
![Language](https://img.shields.io/badge/CSS-gray?logo=css)
![Language](https://img.shields.io/badge/HTML-gray?logo=htmx)

---

## 📌 Summary
- [Description](#description)
- [Instructions](#instructions)
- [Ressources](#ressources)
- [Technical choices & Modules](#technical-choices)
- [Directories structure](#directories-structure)

---

<a id="description"></a>
## 📝 Description

**ft_transcendence** is the final project of the Common Core curriculum at 42 School. It involves building a robust, full-stack website centered around a real-time multiplayer Pong game.

This version of the project (Subject: v18.0) emphasizes adaptability and complex architectural choices. We have designed a Single Page Application (SPA) backed by a **Microservices Architecture**.

### Key Features
* **Microservices Backend**: Built with **Node.js** and **Fastify**, split into specialized services (API Gateway, Auth, Game, User, JWT, 2FA, etc.) for scalability and maintainability.
* **Modern Frontend**: Developed using **TypeScript** and **Vite**, offering a responsive and seamless user experience.
* **Server-Side Pong**: The Pong game logic is entirely calculated on the server-side and exposed via an API to prevent cheating and ensure consistency.
* **Second Game**: Includes a **"Tank" battle game**, featuring custom physics and mechanics.
* **Enhanced Gameplay**:
    * **AI Opponent**: Play against an AI with multiple difficulty levels.
    * **Customization**: Options to customize game experience and rules.
* **Security**:
    * **JWT** (JSON Web Tokens) for secure session management.
    * **2FA** (Two-Factor Authentication) implementation.
    * **HTTPS** support with self-signed certificates generated automatically.
    * **Password hashing** and input validation.
    * **XSS**, **SQL** and **email header injection** proof.
* **DevOps**: Fully containerized using **Docker** and **Docker Compose** for consistent deployment.

---

<a id="instructions"></a>
## 🛠️ Instructions

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
* **Docker** (and Docker Compose)
* **Make**
* **OpenSSL** (for generating SSL certificates)

### Installation & Execution

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/qxxel/ft_transcendence.git
    cd ft_transcendence
    ```

2.  **Environment Setup:**
    Create a `.env` file at the root of `srcs/`. You can use the example below as a template:
    ```bash
    # .env configuration

    # JWT secret key
    # You can generate with command : "openssl rand -base64 32"
    JWT_SECRET=your_jwt_secret_here

    # Email configuration (used for sending emails)
    EMAIL=your_email@gmail.com
    APP_PASS_EMAIL=your_app_password
    ```

3.  **Build and Run:**
    We use a `Makefile` to simplify the management of the Docker containers.
    
    To build the images and start the project:
    ```bash
    make
    ```
    *This command will generate the SSL certificates, build the Docker images, and start the containers.*

4.  **Access the Application:**
    Once the containers are up and running, open your web browser and navigate to:
    * **Frontend**: `https://localhost:8080`
    * *Note: Accept the self-signed certificate warning in your browser.*

### Management Commands
* `make build`: Build the container images.
* `make up`: Start the containers in the background.
* `make down`: Stop and remove the containers.
* `make logs`: View logs from all services (frontend, gateway, auth, game, etc.).
* `make clean`: Stop containers and remove Docker artifacts.
* `make fclean`: Deep clean (removes images, volumes, and build files).

---

<a id="ressources"></a>
## 📚 Ressources

### Documentation
* [Fastify Documentation](https://www.fastify.io/docs/latest/)
* [Vite Documentation](https://vitejs.dev/guide/)
* [Socket.io Documentation](https://socket.io/docs/v4/)
* [Docker Documentation](https://docs.docker.com/)

### AI Usage
*Per the subject requirements, here is a description of how AI tools were used during the development of this project:*

* **Debugging**: Used AI to debug specific CSS flexbox issues and responsive design glitches.
* **Research**: Used AI to clarify specific tool documentation and compare libraries.
* **Content & Naming**: Used AI to draft documentation text, suggest consistent function names, and refine error messages for clarity in English.
* **Feedback**: Used AI provide feedback on certain functions and to suggest alternative implementations.

*(Note: AI was used as a supportive tool for debugging and styling inspiration. All logic was reviewed and integrated manually.)*

---

<a id="technical-choices"></a>
## 🌟 Technical Choices & Modules

This project validates several major and minor modules from the subject:

1.  **Web**:
    * *Major*: Backend built with a Framework (**Fastify**).
    * *Minor*: Frontend built with **TypeScript** and **Vite**.
    * *Minor*: Use of **SQLite** (via volumes) for databases.

2.  **User Management**:
    * *Major*: Standard user management (Registration, Login, Profile, Stats).

3.  **Gameplay**:
    * *Major*: Additional Game (**Tank**).
    * *Major*: Introduce an **AI** opponent (Multiple difficulties).
    * *Minor*: Game **customization options**.

4.  **Cybersecurity**:
    * *Major*: Implementation of **2FA** and **JWT**.

5.  **DevOps**:
    * *Major*: Backend designed as **Microservices** (Gateway, Auth, User, Game, etc.).

6.  **DevOps**:
    * *Minor*: Expanding **browser compatibility** (Firefox, Chrome, Edge, etc.).

7.  **Server-Side Pong**:
    * *Major*: **Replace** basic Pong with **server-side Pong** and implement an **API**.

*(Note: **Two Minor** modules count as **one Major** module. Total: **9 Majors** modules / **7 Majors** modules required)*

---

<a id="directories-structure"></a>
## 📂 Directories structure

```plaintext
📂 ft_transcendence
 ┣ srcs
 ┃  ┣ 📂 backend                → backend files (all services)
 ┃  ┣ 📂 frontend               → frontend files
 ┃  ┗ docker-compose.yml        → global docker compose
 ┣ .gitignore
 ┣ color.mk                     → colors setup for Makefile
 ┣ Makefile
 ┗ README.md
```
