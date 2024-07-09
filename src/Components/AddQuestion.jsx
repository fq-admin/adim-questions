import { useState } from 'react';
import '../App.css';
const AddQuestion = () => {
    const [options, setOptions] = useState(['jglr','gr','ejk','lgr']);
    const [list, setList] = useState([]);

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    // const handleAddOption = () => {
    //     setOptions([...options, '']);
    // };

    const [question, setQuestion] = useState('gldfg');

    const [answer, setAnswer] = useState('3');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            q: question,
            option1: options[0],
            option2: options[1],
            option3: options[2],
            option4: options[3],
            answer: answer
        };
        setList([...list, data]);
        console.log(data);
        fetch('http://localhost:1337/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className='container'>
            <h1>Add Question</h1>
            <form  onSubmit={handleSubmit} className='form'>
                <label htmlFor="">Question</label>
                <br />
                <textarea type="text" placeholder="Question" name='form' 
                    value={question} onChange={(e) => setQuestion(e.target.value)}
                />
                <br />
                <div className='opt'>
                    {options.map((option, id) => (
                        <div key={id}>
                            <label htmlFor={`option${id + 1}`}>{`Option ${id + 1}`}</label>
                            <br />
                            <input
                                key={id}
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(id, e.target.value)}
                                placeholder={`Option ${id + 1}`}
                            />
                            <br />
                        </div>
                    ))}
                </div>

                <label htmlFor="">answer</label>
                <br />
                <textarea type="text" placeholder='answer' value={answer} onChange={(e)=>setAnswer(e.target.value)}/>
                <br />
                <button type='submit'>Submit</button>
            </form>
            <div className="container">
            {list.map((question,id) => (
                <div key={id} className="question">
                    <h2>{id+1}. {question.q}</h2>
                    <ol type='A'>
                        <li>{question['option1']}</li>
                        <li>{question['option2']}</li>
                        <li>{question['option3']}</li>
                        <li>{question['option4']}</li>
                    </ol>
                    <p>{question['answer']}</p>
                </div>
            ))}
        </div>
        </div>
    );
};

export default AddQuestion;