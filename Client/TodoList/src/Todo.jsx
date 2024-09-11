import { useEffect, useState } from "react"

export default function Todo () {
    const [title , setTitle] = useState("");
    const [description , setDescription] = useState("");
    const [todos , setTodos] = useState([]);
    const [error, setError] = useState("");
    const [editId , setEditId ]= useState(-1);
    const [editTitle , setEditTitle]= useState("");
    const [editDescription ,setEditDescription]= useState("");
    const [message , setMessage] = useState("");
    const apiUrl = "http://localhost:3000"

    const handlesubmit = () =>{
        setError("");
        if (title.trim() !== '' && description.trim() !== '' ) {
            fetch(apiUrl +"/todos" ,{
                method : "POST",
                headers : {
                    'content-type': 'application/json'
                },
                body : JSON.stringify({title, description})
            }).then((res) =>{
                if (res.ok) {
                  setTodos([...todos,{title, description }]) 
                  setTitle("");
                  setDescription("");
                  setMessage("item added sucessfully") 
                  setTimeout(() =>{
                    setMessage("");
                  },2000)
                    
                }else {
                    setError("unable to add an item")
                }
            }).catch(() =>{
                setError("unable to add an item")
                
            })
            
        }

        
    } 
    
    useEffect (() => {
        getitems()
    }, [])


    const getitems = () => {
         fetch(apiUrl+"/todos")
         .then((res) => res.json())
         .then((res) =>{
            setTodos(res)
         })
    }
    const handleEdit =(items) =>{
        setEditId(items._id)
        setEditTitle(items.title)
        setEditDescription(items.description)
    }
    const handleUpdate = () =>{
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '' ) {
            fetch(apiUrl +"/todos/"+ editId ,{
                method : "PUT",
                headers : {
                    'content-type': 'application/json'
                },
                body : JSON.stringify({title : editTitle, description :editDescription})
            }).then((res) =>{
                if (res.ok) {

                    const changeItem = todos.map((items)=> {
                        if (items._id == editId) {
                            items.title = editTitle;
                            items.description = editDescription
                            
                        }
                        return items
                    })
                  setTodos(changeItem) 
                  setMessage("item updated sucessfully") 
                  setTimeout(() =>{
                    setMessage("");
                  },2000)

                  setEditId(-1)
                    
                }else {
                    setError("unable to add an item")
                }
            }).catch(() =>{
                setError("unable to add an item")
                
            })
            
        }


    }
    const handleEditcancel = () =>{
        setEditId(-1);
    }

    const handleDelete = (id) => {
        if (window.confirm("are you sure about deleting thid one")) {
            fetch(apiUrl+'/todos/'+id,{
                 method :"DELETE"
            })
            .then(()=> {
                const updated = todos.filter((items) => items._id !== id)
                setTodos(updated)
            })
           
        }
    }

    return  <>
    <div className="row  p-3  bg-success  text-light "   >
        <h1>ToDo Project with MERN-Stack</h1>
    </div>
    <div className="row ">
        <h3>Add item</h3>
        {message && <p className="text-success">{message} </p> }
        <div className="form-group d-flex gap-2">
            <input className="form-control" onChange={(e)=> setTitle(e.target.value)} value={title}  placeholder="Title" type="text" />
            <input  className="form-control" onChange={(e) => setDescription(e.target.value)}  value={description}   placeholder="Description" type="text" />
            <button className="btn btn-dark" onClick={handlesubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
            {
                todos.map((items) =>  <li className="list-group-item bg-info d-flex  justify-content-between align-item-center my-2">
                <div className="d-flex flex-column me-2">
                    {
                        editId == -1 || editId !== items._id ?  <>
                         <span className="fw-bold">{items.title}</span>
                    <span>{items.description}</span>
                    </> : <> 
                    <div className="form-group d-flex gap-2">
                    <input className="form-control" onChange={(e)=> setEditTitle(e.target.value)} value={editTitle}  placeholder="Title" type="text" />
                    <input  className="form-control" onChange={(e) => setEditDescription(e.target.value)}  value={editDescription}   placeholder="Description" type="text" />


                    </div>
                    </>
                    }
                   

                </div>
                <div className="d-flex gap-2">
                    {editId == -1 || editId !== items._id ? <button className="btn btn-warning" onClick={() => handleEdit(items)}>Edit</button>: <button className="btn btn-warning" onClick={handleUpdate}> update</button>}
                    {editId == -1 ? <button className="btn btn-danger" onClick={() => handleDelete(items._id)}> Delete</button>:
                    <button className="btn btn-danger" onClick={handleEditcancel}> cancel</button>}
                </div>

            </li>
   
                )
            }
           
        </ul>
    </div>
    </>
    
}