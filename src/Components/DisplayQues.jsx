import  { useEffect, useState } from 'react';
// import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import axios from 'axios';
import '../App.css';

const DisplayQues = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:1337/api/questions')
            .then(response => {
                const {data} = response.data
                console.log(data)
                setQuestions(data)
    })
            .catch(error => console.log(error));
    }, []);

    return (
        <div className="container">
        <ol type='1'>
            {questions.map((question) => (
                <li key={question.id} className="question">
                <div  >
                    <h3>{question.attributes.q}</h3>
                    <ol type='A'>
                        <li>{question['attributes']['option1']}</li>
                        <li>{question['attributes']['option2']}</li>
                        <li>{question['attributes']['option3']}</li>
                        <li>{question['attributes']['option4']}</li>
                    </ol>
                    <p>{question['attributes']['answer']}</p>
                </div>
                </li>
            ))}

        </ol>
        </div>
    );
};

export default DisplayQues;