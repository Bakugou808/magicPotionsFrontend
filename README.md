# README

Magic Potions -- a Curology Solution

Magic Potions is a site where users get once-in-a-lifetime access to
Curology's life changing magic potions!

The site allows you to order 1-3 Magic Potions upon form completion + submission. Once input fields are filled and validated your order will be processed, a confirmation alert will be displayed to you and the form will reset if the request was successful. Upon failure, errors will be returned and indicators will render, detailing which inputs caused the errors.

##Backend:

Ruby 2.6.1
PostgresSQL DB

To run tests: use the command `rspec [test file path]`

Test File Name:
`spec/requests/order_spec.rb`
`spec/requests/post_order_spec.rb`
`spec/requests/post_order_failure_spec.rb`

##Frontend:
React

To run tests: use the common ‘npm run test’

#Local Usage:

In order to run the site, clone this repository to your local machine. In the repo you will see a frontend and a backend folder. Navigate to the backend folder and run the commands print `'bundle'`, and then `'rails s'` in your terminal to install gems and start the backend server on localhost:3000. Next, in a separate terminal, navigate to the frontend folder and run the commands 'npm install', and then 'npm start' to install dependencies and start the frontend server on localhost:3001.

Alternatively go to [“https://magic-potions-fronend.herokuapp.com/”](https://magic-potions-fronend.herokuapp.com/)
(yes that is the correct url - I made a typo as I was deploying the frontend - whoops!)

#Backend Data Schema:

The database contains a single table called **“Orders”**, each entry contains all the related details to a specific, unique order.

Order attributes:

- Email
- Quantity
- Total
- Credit card number
- Credit card exp.

Under the specs for the site, because each order must have a unique email, it wasn’t necessary to break up the data to separate tables. Indexing through multiple tables would have slowed down queries and seemed excessive for the deliverables of the application. As an addition, the email column on the Order table was indexed to further reduce the chances of duplicates and provide the ORM a faster lookup for the email’s order data within the table. By indexing the email attribute it will by-pass the necessity of iterating through every entry’s attributes to find the value it needs to compare. This will add some additional space requirements to store the extra index, and would generally slow down the speed of writes on the database (in order to write to two places upon creation), however because we need to read the database before every write anyways (to maintain unique emails/orders), it negates the time it would have added. Overall the benefit of indexing the field outweighs the cons in this instance.

The Order model has a number of validations to maintain a robust database. If a validation does not pass, the order will not be created and the errors describing the situation will be returned to the client for review and updated in the UI. Validations include: presence of all fields, email uniqueness, email validity, quantity numericality and range (1-3), credit card details validity and numericality, and total numericality.

With its current requirements, scaling this shouldn’t be a problem. Since the database consists of a single table, and that the service is write-only (from the user’s perspective), if the application needed to scale, the system may require numerous servers to hold the data, write API(s), load balancers and queues to direct the traffic. However because the memory size of each entry is fairly \*small and is limited to one order per email, a modern server should be able to handle whatever memory requirement that is needed.

- _email + orderId + total + ccNum + ccExp + uuid ⇒ (30 + 64 + 32 + 12 + 64 + 4) x bytes = 206 bytes → round up to 250 bytes → if every person made an order the amount of memory required would be less than 2GB_

#Frontend Architecture:

The frontend architecture consists of a Services Folder, CSS folder and Components folder. The Services folder contains a single file called 'api.jsx' that contains the API call for a post request to `‘/api/magic’`. The CSS folder contains the magicPotionImg.png file and OrderPage.css file.

Within the Components folder there are 2 components: OrderPage and OrderForm. The div with id= “root” will load the App component where the child component OrderPage will be loaded, and then the OrderPage’s child component, OrderForm, will be loaded to render the single page to the DOM.

The App component acts as the top level container for the entire application, allowing for new components to be added in the future. The OrderPage component is a parent component that returns a welcome banner to the user and the OrderForm component. The OrderForm component contains all the state and logic of the application. The need to extrapolate the logic to a parent component seemed unnecessary due to the simplicity of the site. The component contains a controlled form that executes three levels of validations: on click, after click, and after submission to the backend API. Validations were created with html input tag attributes, custom verification functions, error responses returned from the server, react hooks, as well as conditional css styling. If a field does not pass validation, errors will be added to the components errors state, defined as an object by the useState hook. The key of each value will identify which ui element needs to be updated to reflect that the field received an error. The input box will be indicated by either a floating notice (for the html tag validations) or a red outline of the input box and red error message beneath. Once the values pass the verification upon 'submit button' click, the error state will be updated and be reflected accurately on the page.

The function validateFields uses a switch statement to iterate through the form’s state and check the validity of each value. The email field is put through a regex operation to confirm it is in the proper format. The quantity field checks the range is between 1 and 3. The total field is dynamically determined by the quantity, and therefore is verified by the quantity verification. The payment fields were verified by integrating a credit card verification library called Card Validator.

#Future Improvements:

With more time and in a different environment I would do a few things differently.

First, I would change the business model and allow for a single email to create an unlimited number of orders. Following this mindset, I would increase the product line and offer additional services such as delivery and user signup.

I would then redesign the database to handle all aspects of the service such as product selection, purchases, payment, inventory, shipping, order history, etc.

As a first pass, I would structure the data somewhat like [this](https://sketchboard.me/xCGtiHnCVBv). (https://sketchboard.me/xCGtiHnCVBv)

In order for this to scale, it would require separate APIs for reads and writes, so users who are browsing vs ordering are siloed to separate flows, load balancers and queues to direct traffic, as well as a number of servers designated to handle specific aspects of the business logic and server failure (multiple servers running the application would allow the load balancers to distribute the traffic in the event of a server crashing).

Depending on the resources available (delivery services, product selection, etc.) the decisions for scaling would change. For instance, we may want to store user data on a different database than the product inventory, and/or delivery/shipping order data.

As an addition, in the instance of data corruption or the database crashing, the application would have its database backed up routinely in the instance it needed to be recovered.

Implementing a Primary/Replica Replication Model would allow for high availability and failover, and could increase read performance by isolating all writes to the Primary database only, and all reads from the Replicas. By spreading the load among multiple Replicas, we would improve performance - at a certain point however, as the number of Replicas increases the network load on the Primary could also increase, creating a bottleneck. At this point it may be worthwhile to designate a primary Replica which would then send its copy of the Primary to the other Replicas , thereby alleviating the load on the Primary.

Depending on the needs of the application, we could also use indexing to reduce the lookup time on tables for specific fields, as well as add additional verification for data integrity.

#Final Thoughts:

Thank you for taking the time to review my code. I look forward to discussing more about the opportunity to work together!

Regards,

Janu
