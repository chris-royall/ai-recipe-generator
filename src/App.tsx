import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { signOut } from 'aws-amplify/auth';

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false); // Track if copied

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }

    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
      .then(() => {
        setCopied(true); // Set the copied state to true
        setTimeout(() => setCopied(false), 2000); // Reset the button state after 2 seconds
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          CR Recipe Generator
          <br />
        </h1>
        <p className="description">
          Enter a list of ingredients, and discover a delicious recipe tailored just for you!
        </p>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredients..."
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>AI is thinking &#x1F914;</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && (
            <div className="result">
              <button
                className={`copy-button ${copied ? "copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <p>{result}</p>
            </div>
          )
        )}
      </div>
      
      <button onClick={handleSignOut} className="signout-button">
        Sign Out
      </button>

      <button className="home-button">
        <a href="https://www.chrisroyall.com" target="_blank">Home</a>
      </button>

      <footer>
        <p><a href="https://www.chrisroyall.com" target="_blank">Christopher Royall</a> | <a href="https://www.termsfeed.com/live/e4a4dd9a-6dfa-4681-8c4c-2d0e62ba3805" target="_blank">Privacy Policy</a></p>
      </footer>

    </div>
  );
}

export default App;