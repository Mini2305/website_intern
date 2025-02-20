<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database configuration
$host = "localhost";
$username = "root";
$password = "";
$dbname = "coffee_shop";

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);
//var_dump($_POST); // If using POST method
var_dump($_GET);  // If using GET method

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Determine the route
$route = $_GET['route'] ?? '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if ($route == 'save-order') {
        // Save order route
        saveOrder($conn, $input);
    } elseif ($route == 'submit-review') {
        // Submit review route
        submitReview($conn, $input);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Invalid route"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
$sql = "INSERT INTO orders (items, total, created_at) VALUES ('$items', $total, NOW())";
if ($conn->query($sql) === TRUE) {
    echo "Data inserted successfully";
} else {
    echo "Error: " . $conn->error;
}


// Save Order Function
function saveOrder($conn, $data)
{
    if (!isset($data['items']) || !isset($data['total'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data"]);
        return;
    }

    $items = json_encode($data['items']);
    $total = $data['total'];

    $query = "INSERT INTO orders (items, total) VALUES (?, ?)";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param("sd", $items, $total); // "sd" indicates string and decimal
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Order saved successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error saving order: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to prepare statement"]);
    }
}

// Submit Review Function
function submitReview($conn, $data)
{
    if (!isset($data['review'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data"]);
        return;
    }

    $review = $data['review'];

    $query = "INSERT INTO reviews (review) VALUES (?)";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param("s", $review); // "s" indicates string
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Review submitted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error saving review: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to prepare statement"]);
    }
}

// Close connection
$conn->close();
?>
