import React, { useState } from "react";
import { v4 as uuidV4 } from 'uuid';
import Styles from './Styles.css'

export default function CreatePrompt() {
    const [responseInput, setResponseInput] = useState("");
    const [list, setList] = useState([
        {
            id: uuidV4(),
            inputPrompt: "What is on your mind?",
            value: "You are on my mind.",
        }
    ]);

    const onSubmit = (event) => {
        event.preventDefault()

        const getData = async () => {
            const data = {
                prompt: responseInput,
                temperature: 0.8,
                max_tokens: 65,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0,
            };
            try {
                const response = await fetch('https://api.openai.com/v1/engines/text-curie-001/completions', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.REACT_APP_USER_KEY}` // opens .env file retrieve api key
                    },
                    body: JSON.stringify(data),
                })
                if (response.ok) {
                    const jsonResponse = await response.json();

                    const promptObj = {
                        id: uuidV4(),
                        inputPrompt: responseInput,            // save current prompt input
                        value: jsonResponse.choices[0].text,   // save resolved response value
                    }

                    setList(list => [...list, promptObj]); // enqueue list state update
                    setResponseInput(''); // clear out prompt value
                }
            } catch (error) {
                console.log(error);
            }
        }
        getData()
    }

    // filter and delete component if id dont match
    const deleteItem = (key) => {
        const arrayList = [...list] //spread out list and put it in array

        const updateList = arrayList.filter(item => item.id !== key); //update list after arrayList is filtered

        setList(updateList); //update list state with updateList
    }

    return (
        <div>
            <main className="ui container heading-container">
                <h1 id="heading">Fun With AI</h1>
                <p id="command-description">Hello, my name is GPT-3. Ask me to do something.</p>
                <div className="ui form">
                    <form className="field" onSubmit={onSubmit}>
                        <label id="prompt-subheading">Enter Prompt</label>
                        <div className='ui input focus'>
                            <textarea
                                type='text'
                                value={responseInput}
                                onChange={(e) => setResponseInput(e.target.value)}>
                            </textarea>
                        </div>
                        <button
                            className="ui button blue right floated"
                            id="submit-button"
                            type="submitß"
                        >Submit</button>
                    </form>
                </div>
            </main>
            <div className="ui container subheading-container">
                <h2 id="response-subheading">Responses</h2>
            </div>
            <div>
                {list.map(item => {
                    return (
                        <div
                            className="ui container new-response-container"
                            key={item.id}
                        >
                            <div>
                                <button
                                    className="ui right floated button grey mini delete-button"
                                    onClick={() => deleteItem(item.id)}
                                >X
                                </button>
                            </div>
                            <div className="info-container">
                                <div className="prompt-container">
                                    <h3 className="response-title">Prompt:</h3>
                                    <p id="prompt-input">
                                        {item.inputPrompt}
                                    </p>
                                </div>
                                <div className="response-container">
                                    <h3 className="response-title">Response:</h3>
                                    <p id="response-result">{item.value}</p>
                                </div>
                            </div>
                        </div>
                    )
                }).reverse()}
            </div>
        </div >
    )
}
