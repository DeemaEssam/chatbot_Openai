<?php
header('Content-Type: application/json'); // Ensure the response is JSON

// Path to the SQLite database file
$db_path = 'database.db';

// Create (connect to) SQLite database in file
$conn = new PDO("sqlite:$db_path");

// Set errormode to exceptions
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Create table if it doesn't exist
$conn->exec("CREATE TABLE IF NOT EXISTS transcripts (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)");

$response = array('status' => 'error', 'message' => 'Unknown error');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['transcript'])) {
        $transcript = $_POST['transcript'];

        // Insert the transcript into the database
        $stmt = $conn->prepare("INSERT INTO transcripts (text) VALUES (:text)");
        $stmt->bindParam(':text', $transcript);
        $stmt->execute();

        $response['status'] = 'success';
        $response['message'] = 'New record created successfully';
    }
} else {
    // Retrieve the last entry from the database
    $stmt = $conn->query("SELECT text FROM transcripts ORDER BY id DESC LIMIT 1");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $response['status'] = 'success';
        $response['message'] = 'Last command retrieved';
        $response['transcript'] = $row["text"];
    } else {
        $response['status'] = 'success';
        $response['message'] = 'No command recorded yet';
        $response['transcript'] = '';
    }
}

// Close the connection
$conn = null;

echo json_encode($response);
?>
