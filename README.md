# Olympic Games

A simple Angular application that displays Olympic Games data, such as the number of medals, athletes, and other statistics by country.

## Prerequisites

Before running the application, you need to have the following tools installed on your machine:

- Node.js (version 14 or higher)
- Angular CLI (version 12 or higher) - npm install -g @angular/cli
- Installing Node.js
- If you don’t have Node.js installed yet, you can download it from the Node.js official website.

## Clone the Project from GitHub

Open your terminal or command prompt.
Clone the GitHub repository of the project using the following command:

git clone https://github.com/Erika-Belicova/olympic-games.git
Replace your-username and repository-name with your GitHub username and the project name, respectively.

Navigate into the cloned project directory:

cd repository-name

## Install Dependencies
Install the required dependencies for the application:

npm install

This will install all the necessary libraries for the application to run properly.

## Running the Application
Start the application with the following command:

ng serve

The application will be available at the following URL:
http://localhost:4200

## Testing the Application
Open a web browser and go to:
http://localhost:4200

On the home page, you will see a dashboard with statistics about the countries participating in the Olympic Games.

- Error: If an error occurs while loading the data, an error message will be displayed at the top of the page.
- Loading: While the data is being fetched, a loading indicator will appear.

## Pages of the Application

Home Page: Displays a dashboard with general statistics about the Olympic Games, including the number of countries, JOs (Olympic Games), and a pie chart with the data.

Detail Page: Shows specific information about each country, such as the number of medals, athletes, and graphical data.

## Technologies and Libraries Used

- Angular: JavaScript framework for building the user interface.
- RxJS: Library for managing asynchronous data streams.
- ngx-charts: Chart library for data visualization.
- FontAwesome: For icons, like the medal icon.
- MatSnackBar (Angular Material): For displaying error messages as snackbars.

## Languages Used

- TypeScript: The main language used for writing Angular code.
- HTML: Used for structuring the user interface.
- CSS / SCSS: For styling and formatting the interface.

## Troubleshooting

If you encounter issues while starting the application, make sure you've installed all dependencies using npm install.
Check for any compilation errors in the console; they will provide information on the issues to resolve.
If there’s an error, an error message will appear at the top of the page.
