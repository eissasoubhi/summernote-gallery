import * as React from "react"; // for JSX rendering

export default (message: string) => (
    <div style={{margin: '1rem'}} className="alert alert-danger">{message}</div>
)

