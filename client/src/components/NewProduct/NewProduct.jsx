import { useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";

const NewProduct = () => {
    const [data, setData] = useState({name:"", description:"", image:""})
    const errModal = useRef();
    const [errmsg, setError] = useState({ msg: "" });
    const {auth} = useAuth()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            console.log(data);
            const response = await fetch(
                process.env.REACT_APP_URL + '/product',{
                    method: 'POST',
                    headers:{
                        authorization: auth.token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
            const res = await response.json();
            if(res.status === 'failure'){
                setError({msg: res.message, class: 'red'});
                errModal.current.style.top = '300px';
            }else{
                setError({msg: 'Product Created Successfully', class: 'green'});
                errModal.current.style.top = '300px';
                setData({name:"", description:"", image:""})
            }

        } catch (error) {
            console.log(error);
            setError({msg: 'Something Went Wrong', class: 'green'});
            errModal.current.style.top = '300px';
        }

    }
    return (
        <main className="main-section">
            <h1 className="create-heading">Create New Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-item"
                        autoComplete="off"
                        name="name"
                        placeholder="Name"
                        onChange={(e) => { setData({ ...data, name: e.target.value }) }}
                        value={data.name}
                        minLength={3}
                        required
                    />
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-item"
                        autoComplete="off"
                        name="description"
                        placeholder="Description"
                        onChange={(e) => { setData({ ...data, description: e.target.value }) }}
                        value={data.description}
                        minLength={5}
                        required
                    />
                </div>
                <div className="input-container">
                    <input
                        type="file"
                        className="input-item"
                        name="image"
                        onChange={(e) => { setData({ ...data, image: e.target.files[0] }) }}
                        required
                    />
                </div>
                <button className="submit">Create</button>
            </form>
            <div ref={errModal} className="error-modal">
                <h1 className={errmsg.class}> {errmsg.msg}</h1>
                <button
                    className="btn"
                    onClick={() => { errModal.current.style.top = '-300px' }}
                >OK</button>
            </div>
        </main>
    )

}
export default NewProduct;
