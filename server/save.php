<?php
header('Content-Type:text/json;charset=utf-8');

// 宣告變數
$host = "120.78.151.121";
$user = "year";
$password = "AHJxa2MGp35PhjRw";
$dbname = "year";

// 取得這次要修改的openID
$openID= $_GET['openID'];

// 取得要更新到資料庫的資料
$userName = $_GET['userInputName'];
$userSchool = $_GET['userInputSchool'];
$userCollege = $_GET['userInputCollege'];
$userMajor = $_GET['userInputMajor'];
$userPhone = $_GET['userInputPhone'];
$userMail = $_GET['userInputMail'];
// $usrPlanetRadius = $_GET['usrPlanetRadius'];
// $usrPlanetTone = $_GET['usrPlanetTone'];
// $usrPlanetMountainHeight = $_GET['usrPlanetMountainHeight'];
// $usrPlanetMountainDensity = $_GET['usrPlanetMountainDensity'];

// 連接資料庫
$connection = mysqli_connect($host, $user, $password, $dbname);

// 检测连接
if (mysqli_connect_errno())
{
    echo "连接失败: " . mysqli_connect_error();
}

// 更新到資料庫上(BK)
mysqli_query($connection, "INSERT INTO sunupcgschoolhiring (open_id, user_realname, user_school, user_college, user_major, user_phone, user_mail) 
VALUES ('$openID', '$userName', '$userSchool', '$userCollege', '$userMajor', '$userPhone', '$userMail')");

// 更新到資料庫上(BK)
// mysqli_query($connection, "UPDATE users SET
// user_realname='$userName',
// user_school='$userSchool',
// user_college='$userCollege',
// user_major='$userMajor',
// user_phone='$userPhone',
// user_mail='$userMail',
// -- planet_radius='$usrPlanetRadius',
// -- planet_tone='$usrPlanetTone',
// -- planet_mountain_height='$usrPlanetMountainHeight',
// -- planet_mountain_width='$usrPlanetMountainDensity'
// WHERE openid='$openID'
// ");

echo '成功'
// 關閉資料庫連接
// mysqli_close($connection);
?>