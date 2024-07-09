import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ImportQues = () => {
  const [mcqs, setMcqs] = useState([]);
  const [level, setLevel] = useState('easy');
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [sid, setSid] = useState(-1);
  const [did, setDid] = useState(-1);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const parsedMcqs = parseMcqs(text); // Implement the parseMcqs function according to your file format

      setMcqs(parsedMcqs);
    };

    reader.readAsText(file);
  };

  const parseMcqs = (text) => {
    // console.log(text);
    const lines = text.split('\n');
    const mcqs = [];
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const [q,option1,option2,option3,option4,answer] = line.split(',').reduce((accum,curr)=>{
        if(accum.isConcatting) {
          accum.soFar[accum.soFar.length-1] += ','+curr
        } else {
          accum.soFar.push(curr)
        }
        if(curr.split('"').length % 2 == 0) {
          accum.isConcatting= !accum.isConcatting
        }
        return accum;
      },{soFar:[],isConcatting:false}).soFar
      if(q === undefined || option1 === undefined || option2 === undefined || option3 === undefined || option4 === undefined || answer === undefined) {
        continue;
      }
      mcqs.push({
        q,
        option1,
        option2,
        option3,
        option4,
        answer
      });
    }
  
    return mcqs;
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/topics?populate=*');
      const data = await response.json();
      console.log(data.data);
      // Set the fetched topics in state
      setTopics(data.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchDifficultyLevels = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/levels');
      const data = await response.json();
      // console.log(data);
      // Set the fetched difficulty levels in state
      setDifficultyLevels(data.data);
    } catch (error) {
      console.error('Error fetching difficulty levels:', error);
    }
  };
  useEffect(() => {

    fetchTopics();
    // fetchSubtopics();
    fetchDifficultyLevels();
  }, []);

  const handleSubmit = async (e) => {
    if(sid === -1 || did === -1) {
      toast.error('All fields are required');
      return;
    }
    e.preventDefault();
    let res=true;
    for (let i = 0; i < mcqs.length; i++) {
      const data = mcqs[i];
      if(data.q === '' || data.option1 === '' || data.option2 === '' || data.option3 === '' || data.option4 === '' || data.answer === '') {
        continue;
      }
      console.log(data);
      data['subtopic'] = sid;
      data['level'] = did;
      const response = await fetch('http://localhost:1337/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data}),
      });
      console.log(response);
      if(response.ok===false) {
        toast.error('Error in uploading questions');
      }
      res&=response.ok;
    }
    if(res) {
      toast.success('Questions uploaded successfully');
    }
    else {
      toast('check strapi server logs for more info')
    }
  }

const handleTopic = (e) => {
  if(e.target.value === -1) {
    return;
  }
  console.log(e.target.value);
  const id=e.target.value;
  const topic = topics[id]
  setSubtopics(topic.attributes.subtopics.data);
  console.log(subtopics);
}

const handleSubtopic = (e) => {
  if(e.target.value === -1) {
    return;
  }
  console.log(e.target.value);
  const id=e.target.value;
  setSid(id);
}

const handleDifficulty = (e) => {
  if(e.target.value === -1) {
    return;
  }
  console.log(e.target.value);
  const id=e.target.value;
  setDid(id);
}

  return (
    
    <div>
      <h1>MCQs</h1>
      <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
         
      {mcqs.length === 0 ?<></>:<>
      {/* <form onSubmit={handleSubmit}> */}
      <br />
        <select onChange={handleTopic}>
          <option value={-1}>Select Topic</option>
          {topics.length>0? topics.map((topic,i) => (
            <option key={i} value={i} >{topic.attributes.name}</option>

          )):<></>}
        </select>
        <select onChange={handleSubtopic}>
          <option value={-1}>Select Subtopic</option>
          {subtopics.length>0? subtopics.map((subtopic) => (
            <option key={subtopic.id} value={subtopic.id}>{subtopic.attributes.name}</option>
          )):<></>}
        </select>
        <select onChange={handleDifficulty}>
          <option value={-1}>Select Difficulty Level</option>
          {difficultyLevels.length>0? difficultyLevels.map((level) => (
            <option key={level.id} value={level.id}>{level.attributes.level}</option>
          )):<></>}
        </select>
        <button onClick={handleSubmit}>Submit</button>
      {/* {/* </form> */}
      </>}
      {mcqs.map((mcq, index) => (
        <div key={index}>
          <h3>{mcq.q}</h3>
          <ol type='A'>
            <li>{mcq.option1}</li>
            <li>{mcq.option2}</li>
            <li>{mcq.option3}</li>
            <li>{mcq.option4}</li>
          </ol>
          <p>Answer : {mcq.answer}</p>
        </div>
        
      ))}
      <ToastContainer/>
    </div>
  );
};

export default ImportQues;
