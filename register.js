import readlineSync from "readline-sync";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { error } from "console";

const DETAILSFILEPATH = "./details.json";
const ERRORFILEPATH = "./error.txt";
const empInfos = getDetails();
console.log("welcome");
const startTime = new Date().getMinutes();
showOptions();

function showOptions() {
  console.log("1. Create new employee ");
  console.log("2. Update employee record ");
  console.log("3. Delete employee ");
  console.log("4. Display employees by department ");
  console.log("5. Display employee by employee id ");
  console.log("6. exit ");
  const option = readlineSync.question("choose option ");
  chooseOption(option);
}

function chooseOption(option) {
  switch (option) {
    case "1":
      addEmployeeDetails();
      break;
    case "2":
      updateEmployeeDetails();
      break;
    case "3":
      deleteEmployeeDetails();
      break;
    case "4":
      viewDepartmentDetails();
      break;
    case "5":
      viewEmployeeDetails();
      break;
    case "6":
      exitFromSession();
      break;
    default:
      showOptions();
  }
}

function addEmployeeDetails() {
  try {
    const empName = readlineSync.question("Please enter your name");
    const empDOB = readlineSync.question(
      "Please enter your date of birth dd/mm/yyyy"
    );
    const empDepartment = readlineSync.question("Please enter your department");
    const age = getAge(empDOB);
    const details = {
      empId: uuidv4(),
      empName,
      empDOB,
      empDepartment,
      empAge: age,
    };
    const employeeIndex = empInfos.findIndex(
      (obj) => obj.empName === details.empName
    );
    if (employeeIndex !== -1) {
      console.log("empName Exist");
      showOptions();
    }
    empInfos.push(details);
    addDetails(empInfos);
    console.log("Employee details added successfully");
    showOptions();
  } catch (error) {
    console.log(`error occurred while adding details ${error.message}`);
    errorWriting(error);
  }
}

function getAge(DOB) {
  const DOBArray = DOB.split("/");
  const birthDate = new Date(DOBArray[2], DOBArray[1] - 1, DOBArray[0]);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  return age;
}

function getDetails() {
  try {
    const data = fs.readFileSync(DETAILSFILEPATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`error occurred while taking details ${error.message}`);
    errorWriting(error);
  }
}

function addDetails(empInfos) {
  try {
    fs.writeFileSync(DETAILSFILEPATH, JSON.stringify(empInfos));
  } catch {
    errorWriting(error);
    console.log(
      `error occurred while adding details to JSON file-${error.message}`
    );
  }
}

function errorWriting(error) {
  const today = new Date();
  today.setTime(today.getTime());
  const currentTime = today.toUTCString();
  const errorDetails = `${error.message}----time:${currentTime}\n`;
  fs.appendFileSync(ERRORFILEPATH, errorDetails);
}

function updateEmployeeDetails() {
  try {
    const empId = readlineSync.question("Please enter the employee id");
    const updatedEmployee = empInfos.find(
      (employee) => employee.empId === empId
    );
    if (updatedEmployee) {
      const updatedName = readlineSync.question(
        `please enter name  ${updatedEmployee.empName}: `
      );
      const updatedDOB = readlineSync.question(
        ` please enter DOB (dd/mm/yyyy) ${updatedEmployee.empDOB}: `
      );
      const updatedDepartment = readlineSync.question(
        ` please enter department ${updatedEmployee.empDepartment}: `
      );
      const age = getAge(updatedDOB);
      updatedEmployee.empAge = age;
      updatedEmployee.empName = updatedName;
      updatedEmployee.empDOB = updatedDOB;
      updatedEmployee.empDepartment = updatedDepartment;
      addDetails(empInfos);
      console.log("Employee details updated successfully");
      showOptions();
    }
    console.log("no employee exist");
    showOptions();
  } catch (error) {
    console.log(`error occurred while updating details ${error.message}`);
    errorWriting(error);
  }
}

function deleteEmployeeDetails() {
  try {
    const empId = readlineSync.question("Please enter employee id");
    const employeeIndex = empInfos.findIndex(
      (employee) => employee.empId === empId
    );
    if (employeeIndex !== -1) {
      empInfos.splice(employeeIndex, 1);
      addDetails(empInfos);
      console.log("delete employee successfully");
      showOptions();
    }
    console.log("no employee exist");
    showOptions();
  } catch (error) {
    console.log(`error occurred while deleting details ${error.message}`);
    errorWriting(error);
  }
}

function viewEmployeeDetails() {
  try {
    const empId = readlineSync.question("Please enter employee id");
    const employee = empInfos.find((employee) => employee.empId === empId);
    if (!employee) {
      console.log("No employee exist");
      showOptions();
    }
    console.log(employee);
    showOptions();
  } catch (error) {
    console.log(`error occurred while displaying details ${error.message}`);
    errorWriting(error);
  }
}

function viewDepartmentDetails() {
  try {
    const empDepartment = readlineSync.question(
      "Please enter employee department"
    );
    let count = 0;
    empInfos.forEach((employee) => {
      if (employee.empDepartment === empDepartment) {
        console.log(employee);
        count++;
      }
    });

    if (count) {
      console.log(
        `number of employees in ${empDepartment} department" , ${count}`
      );
      showOptions();
    }
    console.log(`No employees under ${empDepartment} department`);
    showOptions();
  } catch (error) {
    console.log(
      `error occurred while displaying department details ${error.message}`
    );
    errorWriting(error);
  }
}

function exitFromSession() {
  const endTime = new Date().getMinutes();
  const totalTime = Math.floor(endTime - startTime);
  console.log(`Your session duration: ${totalTime} minutes.`);
}
