<?php

$link = mysqli_connect("localhost", "general", "5C9KDqMJ", "hpa");
$pid = $_GET['pid'];

$query = "SELECT * FROM projects WHERE pid = $pid;";
$result = mysqli_query($link,$query);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo $row["project"];
    }
} else {
    echo "NULL";
}

?>
