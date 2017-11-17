<?php

$link = mysqli_connect("localhost", "general", "5C9KDqMJ", "hpa");
$uid = $_GET['uid'];

$query = "SELECT * FROM students WHERE uid = $uid;";
$result = mysqli_query($link,$query);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo $row["firstName"]. " " . $row["lastName"];
    }
} else {
    echo "NULL";
}

?>
