# Usage

### Please note that this guide was made for Windows. If you use a different OS, adapt the instructions to suit you.

## Section 1: Node.js

1. Go to the [Node.js website](https://nodejs.org/en "Node.js")
2. Select a version. Select the left option if you want it to have less bugs. Select the right for the latest version.
3. Follow the installation instructions.
4. Open command prompt or terminal in the root of the website code.
5. Type the following command:

```bash
npm i
```

## Section 2: XAMPP

1. Visit the [XAMPP website](https://www.apachefriends.org/index.html).
2. Download the appropriate version for your operating system.
3. Follow the installation instructions.

## Section 3: Database Setup

1. Open the XAMPP control panel.
2. Start Apache and MySQL.

> If MySQL doesn't startup, attempt running "xampp.bat"

3. Now, click on the "Admin" button next to MySQL.
4. Click on "User accounts"
5. Enter the following info for the account:

> Username: xampp
>
> Hostname: localhost
>
> Password: password
>
>
> For user permissions, give global privileges.

6. Create a new database called "mediamix" and click into it.
7. Click on the "Import" button on the top and select the "database_schema.sql" file in the root.

## Section 4.1 (*Optional*): VS Code

1. If you have VS Code, open it.
2. In "File", click "Open Workspace from File"
3. Select the "MediaMix.code-workspace" file in the root.

## Section 4.2: Environment Variables

1. In the root, create a new file called ".env"
2. In the file, type the following:

```
# DB Login Stuff

DB_HOSTNAME=localhost
DB_USERNAME=xampp
DB_PASSWORD=password
DB_NAME=mediamix

# Other Stuff Here...

IP_ADDRESS=192.168.0.145 # Use your own local IP address
```

> If there are issues with the database login, go to XAMPP and next to MySQL, there is a button saying "Config". Click that and select my.ini. Check there and look for the hostname, password, username and database name. Otherwise, it should just say those in "<>" and that means they are just the default.

## Section 4.3: Uploads folder

Navigate to the public folder and create a folder called "uploads"

## Section 5.1: Running

1. Go to the root and open run.bat

## Section 5.2: Shutting Down

1. Close the command prompt window which opened when you clicked run.bat

> If the website is up after shutting it down, open "shutdown.bat"

## Section 5.3: Issues with MySQL opening

1. Open "xampp.bat"
