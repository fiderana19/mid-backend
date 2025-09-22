# 💻 MININTER: Audience (backend)

MININTER: Audience (backend) is a NestJS application designed to manage and store data about audiences with the Minister of the Interior.
It's developped for MongoDB as database management system.

-----

## ✨ Features

The app incorporates features for better performance, such as:

  * Data integrity.
  * Validation.
  * Authorization.
  * Role based route access.

-----

## 🚧 Status

The application is still in progress for a better source code, new features, and updates.

-----

## Getting Started

### Prerequisites

* Node.js
* npm or yarn
* MongoDB server

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```
2.  Install the required modules. Be sure to execute the following command for modules installation:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn
    ```

### Running the MongoDB Server

Don't forget to run the MongoDB server.

### Running the App

Run the application with the following command:
```bash
npm run dev
```

-----

## The features

There's a few screenshoot to show the app's features.

* **🔒 Data integrity**
The data passed with the request will be verified in the database, inexistent and incorrect data will be handled. 

<p align="center">
<img src="https://github.com/fiderana19/mid-backend/blob/feat/readme/src/assets/readme/security.png?raw=true" alt="Data Integrity" width="800"/>
</p>

* **🔒 Validation**
The data will pass a strict validation as empty data, invalid email, uncomplete data will not be allowed.

<p align="center">
<img src="https://github.com/fiderana19/mid-backend/blob/feat/readme/src/assets/readme/validation.png?raw=true" alt="Validation" width="800"/>
</p>

* **🔒 Authorization**
As the application have a logged in user, only a logged in user will have the authorization for data security.

<p align="center">
<img src="https://github.com/fiderana19/mid-backend/blob/feat/readme/src/assets/readme/unauthorized.png?raw=true" alt="Authorization" width="800"/>
</p>

* **🔒 Role based access route**
There's two type of user role in the app, some ressources will be accessed by the user's role.

<p align="center">
<img src="https://github.com/fiderana19/mid-backend/blob/feat/readme/src/assets/readme/role_based.png?raw=true" alt="Role based access route" width="800"/>
</p>

-----

## ⭐️ Star

Don't hesitate to give a star, it will gives me a motivation for my projects and my progress.