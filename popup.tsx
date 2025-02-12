import { useState } from "react";
import dayjs from "dayjs";

const sampleData = [
  {
    body: "remove this line gap",
    created_at: "2025-02-12T18:35:16Z",
    html_url: "https://github.com/khushichhonkare/demo-repo/pull/1#discussion_r1953208196"
  },
  {
    body: "remove this line too",
    created_at: "2025-02-12T18:35:25Z",
    html_url: "https://github.com/khushichhonkare/demo-repo/pull/1#discussion_r1953208362"
  }
];

function IndexPopup() {
  const [data, setData] = useState(sampleData);

  return (
    <div style={{ padding: 10 }}>
      <h2>GitHub Comments</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Body</th>
            <th>Created At</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.body}</td>
              <td>{dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
              <td>
                <a href={item.html_url} target="_blank" rel="noopener noreferrer">
                  View Discussion
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IndexPopup;
