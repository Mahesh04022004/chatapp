import axios from "axios";
import React, { useEffect, useState } from "react";

const ChatWindow = ()=>{

    const [message,setMessage] = useState([]);
    const [sender,setSender] = useState('');
    const [content,setContent] = useState('');

    const fetchMessage = async () =>{
        try {
            const res = await axios.get('http://localhost:9921/api/messages');
            setMessage(res.data);
        } catch (error) {
            console.log("Error in fetchMessgae",error);
            
        }
    }

    const sendMessage = async (e)=>{
        e.preventDefault();
        if(sender && content){
            try {
                axios.post('http://localhost:9921/api/messages',{sender,content})
                setContent('');
                fetchMessage();
            } catch (error) {
                console.log("Error in sendMessage",error);
            }
        }
    }

    useEffect(()=>{
        fetchMessage();
    },[]);

    return <>
        <div className="container mt-5">
            <h3 className="text-center mb-4">💬 Mahesh's Chat App</h3>
            <div className="border p-3 rounded bg-light mb-3" style={{ height: '400px', overflowY: 'scroll' }}>
                <div className="mb-2">
                    {
                        message.map((msg)=>(
                            <div key={msg.id} className="mb-2">
                                <strong>{msg.sender}:</strong> {msg.content}
                            </div>
                        ))
                    }
                </div>
            </div>

            <form onSubmit={sendMessage}>
                <div className="row g-2">
                  <div className="col-md-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-7">
                    <input
                      type="text"
                      placeholder="Type your message"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-primary w-100">Send</button>
                  </div>
                </div>
        </form>
    </div>

    </>
}

export default ChatWindow;