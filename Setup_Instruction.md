
# MongoDB Installation on Windows

## 1. Installing MongoDB Server

1. Go to the [MongoDB Community Server download page](https://www.mongodb.com/try/download/community-kubernetes-operator).

2. Under **Community Server**, click **Choose Packages**.

3. From the version dropdown, select:

   **Version: `7.0.43`**

4. Keep the remaining options as they are and click **Download**.

---

## 2. Installing MongoDB Compass

1. Go to the [MongoDB Compass download page](https://www.mongodb.com/try/download/compass).

2. Scroll down a little.

3. Keep all the options as they are and click **Download**.

---

# 3. Setting Up MongoDB

Once both **MongoDB Server** and **MongoDB Compass** have been installed, set up the MongoDB server.

### Installing MongoDB Server

1. Open the MongoDB Server installer.

2. Click **Next** through the installation steps.

3. Complete the installation using the default settings.

Once the installation is complete, open **MongoDB Compass**.

### Connecting to the Local MongoDB Server

In MongoDB Compass:

1. Click the **`+`** button to add a new connection.

   ![MongoDB Compass Add Connection](images/mongodb-compass-add-connection.png)

2. Keep the **URI** as it is.

3. For the connection name, enter:

   `ERP-LMS`

   You can use any name you prefer.

4. Click **Save & Connect**.

After connecting, a new connection will appear in the left-hand panel.

![MongoDB Compass Connection](images/mongodb-compass-connection.png)

---

# 4. Creating the Database

1. Hover over the newly created connection.

2. Click the **`+`** button next to it.

   ![MongoDB Create Database](images/mongodb-create-database.png)

3. This will open the **Create Database** window.

> **Important:** The database name must be exactly the same as the one specified below.

### Database Name

```text
ERP-Resources
```

### Collection Name

```text
courses
```

4. Enter the database and collection names.

5. Click **Create Database**.

You are now ready to proceed with the next steps.

---

# 5. Cloning the Repository

## Step 1: Open VS Code

Open **Visual Studio Code**.

From the toolbar, select:

**Terminal → New Terminal**

Before running the command, check the current terminal path.

It should look similar to:

```powershell
PS C:\Users\<Your_username>>
```

If required, change the directory to the location where you want to clone the project.

---

## Step 2: Clone the Repository

Run the following command in the terminal:

```powershell
git clone https://github.com/MiniProject-Clg-Lvl-Projects/Unispace.git
```
Press **Enter** and wait for the repository to finish cloning.
---

## Step 3: Open the Project in VS Code

Once the repository has been cloned:

1. Click **File** in the VS Code toolbar.
2. Select **Open Folder**.
3. Navigate to the folder where the repository was cloned.
4. Select the **Unispace** folder.
5. Open the folder in VS Code.

---

# 6. Running the Website

Once the project folder is opened in VS Code, open a new terminal in the project folder.

Run the required commands in the same terminal to start the website.

Run npm init first <br>
for installing requirements <br>
Run npm install <br>
<br>
To run the frontend <br>
npm run dev <br>

To run the backend / server <br>
cd src <vr>
node Server.ts <br>
OR
nodemon Server.ts <br>

