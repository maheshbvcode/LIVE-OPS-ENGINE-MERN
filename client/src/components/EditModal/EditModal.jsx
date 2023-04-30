import { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import useAuth from '../../hooks/useAuth';
import { daysOptions, monthsOption, datesOption } from '../../helpers/options';
import './EditModal.css';


const EditModal = ({ offer, setEdit, setError, errModal, fetchData }) => {
    const url = process.env.REACT_APP_URL;
    const [data, setData] = useState({
        offerTitle: offer.offerTitle,
        offerDescription: offer.offerDescription,
        target: offer.target,
        coins: offer.pricing[0].currency === 'coins' ? offer.pricing[0].cost : offer.pricing[1].cost,
        gems: offer.pricing[0].currency === 'gems' ? offer.pricing[0].cost : offer.pricing[1].cost
    })
    const [product, setProducts] = useState({ products: [], content: [], display: [] })
    const [days, setDays] = useState(null);
    const [months, setMonths] = useState(null);
    const [dates, setDates] = useState(null);
    const [item, setItem] = useState({ id: "", quantity: "", name: "" });
    const { auth } = useAuth();
    const scrollInto = useRef();

    const initializeStates = () => {

        let days = daysOptions.filter((item) => {
            return offer.schedule.days.includes(item.value);
        })
        setDays(days);
        let dates = datesOption.filter((item) => {
            return offer.schedule.dates.includes(item.value);
        })
        setDates(dates);
        let months = monthsOption.filter((item) => {
            return offer.schedule.months.includes(item.value);
        })
        setMonths(months);
        scrollInto.current.scrollIntoView()

    }

    const fetchProducts = async () => {
        try {
            const response = await fetch(url + '/product', {
                headers: {
                    authorization: auth.token
                }
            })
            const res = await response.json();
            if (res.status === 'success') {
                let arr1 = offer.content.map((ele) => { return { quantity: ele.quantity, item: ele.item._id } })
                let arr2 = offer.content.map((ele) => { return { quantity: ele.quantity, name: ele.item.name } })
                setProducts({products: res.result, content: arr1, display: arr2 });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemove = (e) => {
        e.preventDefault()
        let index = e.target.id;
        console.log(index)
        let arr1 = product.content.filter((item, ind) => ind !== index);
        let arr2 = product.display.filter((item, ind) => ind !== index)

        setProducts({ ...product, content: arr1, display: arr2 });
    }

    const addItem = (e) => {
        e.preventDefault()
        if (item.id && item.quantity) {
            setProducts({ ...product, content: [...product.content, { item: item.id, quantity: item.quantity }], display: [...product.display, { name: item.name, quantity: item.quantity }] });
            setItem({ item: "", quantity: "", name: "" })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let formDays = days.map((item)=>item.value)
        let formDates = dates.map((item)=>item.value)
        let formMonths = months.map((item)=>item.value)
        let obj = {
            offerId: data.offerId,
            offerTitle: data.offerTitle,
            offerDescription: data.offerDescription,
            content: product.content,
            schedule:{
                days: formDays,
                dates: formDates,
                months: formMonths
            },
            target: data.target,
            pricing:[
                {
                    currency: 'coins',
                    cost: data.coins
                },
                {
                    currency: 'gems',
                    cost: data.gems
                }
            ]
        }
        try {
            const response = await fetch(
                url + `/offer/${offer.offerId}`,
                {
                    method: 'PUT',
                    headers:{
                        authorization: auth.token,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                }
            )
            const res = await response.json();
            if (res.status === 'failure') {
                setError({ msg: res.message, class: 'red' });
                errModal.current.style.top = '300px';
            }
            else {
                setError({ msg: res.message, class: 'green' });
                errModal.current.style.top = '300px';
                setEdit(false)
                fetchData();
            }
        } catch (error) {
            console.log(error);
            setError({ msg: 'something went wrong', class: 'red' });
            errModal.current.style.top = '300px'
        }
    }

    useEffect(() => {
        initializeStates()
        fetchProducts()
    }, [offer.offerId])
    return (
        <section ref={scrollInto} className="edit-section">
            <h1 className="create-heading">Edit Offer: {offer.offerId}</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-item"
                        name="offerTitle"
                        placeholder="Offer Title"
                        autoComplete="off"
                        onChange={(e) => { setData({ ...data, offerTitle: e.target.value }) }}
                        value={data.offerTitle}
                        required
                    />
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-item"
                        name="offerDescription"
                        autoComplete="off"
                        placeholder="Offer Description"
                        onChange={(e) => { setData({ ...data, offerDescription: e.target.value }) }}
                        value={data.offerDescription}
                        required
                    />
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-item"
                        name="target"
                        autoComplete="off"
                        placeholder="Targer Users"
                        onChange={(e) => { setData({ ...data, target: e.target.value }) }}
                        value={data.target}
                        required
                    />
                    <p className="red">*Use only ANDed or ORed statements here. Type 'all' to apply for all users</p>
                </div>
                <div className="input-container">
                    <h2>Days: </h2>
                    <Select
                        value={days}
                        onChange={setDays}
                        isMulti={true}
                        options={daysOptions}
                        required
                    />

                </div>
                <div className="input-container">
                    <h2>Date: </h2>
                    <Select
                        value={dates}
                        onChange={setDates}
                        isMulti={true}
                        options={datesOption}
                        required
                    />
                </div>
                <div className="input-container">
                    <h2>Months: </h2>
                    <Select
                        value={months}
                        onChange={setMonths}
                        isMulti={true}
                        options={monthsOption}
                        required={true}
                    />

                </div>
                <div className="input-container">
                    <h2>Pricing</h2>
                    <input
                        type="number"
                        className="input-item"
                        name="coins"
                        autoComplete="off"
                        placeholder="Coins"
                        onChange={(e) => { setData({ ...data, coins: e.target.value }) }}
                        value={data.coins}
                        required
                    />
                    <input
                        type="number"
                        className="input-item"
                        name="gems"
                        placeholder="Gems"
                        autoComplete="off"
                        onChange={(e) => { setData({ ...data, gems: e.target.value }) }}
                        value={data.gems}
                        required
                    />
                </div>
                <div className="product-input input-container">
                    <h2 className="contents-container">Selected Products: </h2>
                    <div className="products-selected">
                        {
                            product.display.length === 0 &&
                            <h3 className="red">*Select atleast 1 product for the offer</h3>
                        }
                        {
                            product.display.map((content, index) => {
                                return (
                                    <div className="content" key={index}>
                                        <h3>{content.name + ' : ' + content.quantity}<button className="btn" id={index} onClick={handleRemove}>Remove</button></h3>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <input
                        type="text"
                        name="item"
                        placeholder="Product"
                        value={item.name}
                        readOnly
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        autoComplete="off"
                        value={item.quantity}
                        onChange={(e) => { setItem({ ...item, quantity: e.target.value }) }}
                    />
                    <button
                        className="btn"
                        onClick={addItem}
                    >Add</button>
                </div>
                <h2>Select new products: </h2>
                <p>*Click below products to select</p>
                <div className="products-container">
                    {
                        product.products.map((product, index) => {
                            return (
                                <div className="product-image" key={index} onClick={() => setItem({ ...item, id: product._id, name: product.name })}>
                                    <img src={url + '/uploads/' + product.image} alt="" />
                                    <h3>{product.name}</h3>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="btns">
                    <button
                        className="update"
                    >Update</button>
                    <button className="discard" onClick={(e)=>{e.preventDefault();setEdit(false)}}>Discard</button>
                </div>
            </form>

        </section>

    )
}
export default EditModal;