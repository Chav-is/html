<?php


if (isset ($_GET["pid"])) {
  include 'projectPage.html';
} else {
  include 'projectGallery.html';
}


?>
