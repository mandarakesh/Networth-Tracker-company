# CrediKhaata Backend

CrediKhaata is a RESTful backend service designed for small shopkeepers to manage customer loan transactions, track repayments, and view summaries.

## Technologies Used

* Node.js
* Express
* MongoDB
* JSON Web Token (JWT)
* Moment.js
* Dotenv

## 📦 Setup

1. Create a `.env` file in the root and add:

MONGO_URI=Mongo_Url
JWT_SECRET=My_jwt_secret_key
PORT=5000


## Authentication APIs

### Register

`POST /api/auth/register`

#### Request Body:

json
{
  "name": "rajesh",
  "email": "rajesh@example.com",
  "password": "1234"
}


#### Response:

json
{ "message": "User registered" }


### Login

`POST /api/auth/login`

#### Request Body:

json
{
  "email": "ramesh@example.com",
  "password": "123456"
}


#### Response:

json
{ "token": "jwt_token" }


## 👤 Customer APIs *(Require JWT Token in Authorization header)*

### Add Customer 

`POST /api/customers`

json
{
  "name": "rajesh",
  "phone": "9876543210",
  "trustScore": 70
}


**Response:**

json
{ "message": "Customer added" }


### Get All Customers *(Require JWT Token)*

`GET /api/customers`

json
[
  { "_id": "...", "name": "rajesh", ... }
]


### Update Customer *(Require JWT Token)*

`PUT /api/customers/:id`

json
{
  "name": "rajesh",
  "phone": "9876543210",
  "trustScore": 70
}


**Response:** 

json
{ "message": "Customer updated" }

### Delete Customer *(Require JWT Token)*

`DELETE /api/customers/:id`
json
{ "message": "Customer deleted" }


## 💳 Loan APIs *(Require JWT Token)*

### Create Loan

`POST /api/loans`

json
{
  "customerId": "customer_id",
  "amount": 2000,
  "dueDate": "2025-05-30"
}


**Response:**

json
{ "message": "Loan created" }




### Loans All Api's

### Get Loans

`GET /api/loans`

json
[
  { "_id": "...", "amount": 2000, "status": "pending", ... }
]


### Record Repayment

`POST /api/loans/:id/repay`

json
{
  "amount": 1000
}

**Response:**
json
{ "message": "Repayment recorded" }



### Get Summary

`GET /api/loans/summary`

json
{
  "totalLoaned": 5000,
  "totalCollected": 3000,
  "overdueAmount": 2000
}

### Get Overdue Loans

`GET /api/loans/overdue`


json
[
  { "_id": "...", "customerId": "...", "status": "overdue" }
]






