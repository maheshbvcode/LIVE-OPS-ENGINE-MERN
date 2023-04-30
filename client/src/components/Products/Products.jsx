import { useEffect, useState, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import './Products.css';

const Products = () => {
    const { auth } = useAuth()
    const [products, setProducts] = useState([]);
    const errModal = useRef();
    const [errmsg, setError] = useState({ msg: "" });
    const url = process.env.REACT_APP_URL;

    const fetchProducts = async () => {
        try {
            const response = await fetch(url + '/product', {
                headers: {
                    authorization: auth.token
                }
            })
            const res = await response.json();
            if (res.status === 'success') {
                setProducts(res.result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (e) => {
        let id = e.target.id;
        try {
            const response = await fetch(
                url + `/product/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        authorization: auth.token
                    }
                }
            )
            const res = await response.json();
            if(res.status === 'failure'){
                setError({msg: res.message, class: 'red'});
                errModal.current.style.top = '300px';
            }else{
                setError({msg: 'Product Deleted Successfully', class: 'green'});
                errModal.current.style.top = '300px';
                fetchProducts();
            }

        } catch (error) {
            console.log(error);
            setError({msg: 'Something Went Wrong', class: 'green'});
            errModal.current.style.top = '300px';
        }

    }

    useEffect(() => {
        fetchProducts()
    }, []);
    return (
        <>
            <div className="all-products">
                {
                    products.map((product, index) => {
                        return (
                            <div className="product-image" key={index} >
                                <img src={url + '/uploads/' + product.image} alt="" />
                                <h3>{product.name}</h3>
                                <button className='btn' id={product._id} onClick={handleDelete}>Delete</button>
                            </div>
                        )
                    })
                }
            </div>
            <div ref={errModal} className="error-modal">
                <h1 className={errmsg.class}> {errmsg.msg}</h1>
                <button
                    className="btn"
                    onClick={() => { errModal.current.style.top = '-300px' }}
                >OK</button>
            </div>
        </>
    )
}

export default Products