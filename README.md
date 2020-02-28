# Interview Scheduler

React SPA application that allows users to book and cancel interviews. Data is persisted by the API server using a PostgreSQL database which can be found at https://github.com/Hayder-Suwaed/scheduler-api. The client application communicates with an API server over HTTP, using the JSON format. Jest tests are used through the development of the project. As well as storybook and Cypress. We combine a concise API with a WebSocket server to build a realtime experience.

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

npm start

## Running Jest Test Framework

npm test

## Running coverage Jest test data

npm test -- --coverage --watchAll=false

## Running Storybook Visual Testbed

npm run storybook

## Running Cypress testing tool

npm run cypress

## Key Features

• Interviews can be booked between Monday and Friday.

• A user can switch between weekdays.

• A user can book an interview in an empty appointment slot.

• Interviews are booked by typing in a student name and clicking on an interviewer from a list of available interviewers.

• A user can cancel an existing interview.

• A user can edit the details of an existing interview.

• The list of days informs the user how many slots are available for each day.

• The expected day updates the number of spots available when an interview is booked or canceled.

• A user is presented with a confirmation when they attempt to cancel an interview.

• A user is shown an error if an interview cannot be saved or deleted.

• When a user books or cancels an interview, all connected users see the update in their browser.

## Technical Specifications

    • React
    • Webpack, Babel
    • Axios, WebSockets
    • Storybook, Jest, Testing Library, Cypress

## Final Product

!["screenshot of Book-Interview"](https://github.com/Hayder-Suwaed/scheduler/blob/master/public/images/Booking-Interview.png)

!["screenshot of Book-Interview"](https://github.com/Hayder-Suwaed/scheduler/blob/master/public/images/Booking-Interview.png)

!["screenshot of Confirmation-before-Deleting"](https://github.com/Hayder-Suwaed/scheduler/blob/master/public/images/Confirmation%20of%20delete.png)

!["screenshot of Deleting"](https://github.com/Hayder-Suwaed/scheduler/blob/master/public/images/Deleting.png)

!["screenshot of Interviewer-Scheduler"](https://github.com/Hayder-Suwaed/scheduler/blob/master/public/images/main.png)

!["screenshot of Spots remaining"](https://github.com/Hayder-Suwaed/scheduler/blob/master/public/images/Spots-remaining.png)

!["screenshot of Saving"](https://github.com/Hayder-Suwaed/scheduler/blob/master/public/images/Saving.png)

## Reference

• [React Documentation](https://reactjs.org/docs/getting-started.html)
•[ Storybook Documentation](https://storybook.js.org/docs/basics/introduction/)
• [Jest Documentation](https://jestjs.io/docs/en/getting-started)
• [Axios Example](https://github.com/axios/axios)
• [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)
