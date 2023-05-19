CREATE TABLE "users" (
"userid" SERIAL PRIMARY KEY,
"username" TEXT NOT NULL,
"email" TEXT NOT NULL,
"phone" TEXT NOT NULL,
"password" TEXT NOT NULL,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE "admin" (
"adminid" serial PRIMARY KEY,
"name" TEXT NOT NULL,
"password" TEXT NOT NULL,
"phone" TEXT NOT NULL,
"email" TEXT NOT NULL,
"image" TEXT
)

CREATE TABLE "car" (
"carid" SERIAL PRIMARY KEY,
"carname" TEXT NOT NULL,
"price" TEXT NOT NULL,
"year" TEXT NOT NULL,
"model" TEXT NOT NULL,
"color" TEXT NOT NULL,
"make" TEXT NOT NULL,
"transmission" TEXT NOT NULL,
"condition" TEXT NOT NULL,
"fuel" TEXT NOT NULL,
"engine" TEXT NOT NULL,
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE "carimg" (
"carimgid" SERIAL PRIMARY KEY,
"carid" integer NOT NULL,
"image" TEXT,
FOREIGN KEY (carid) REFERENCES car (carid),
"syscreatedatutc" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);
