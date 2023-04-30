import { useEffect, useRef, useState } from "react";
import useAuth from '../../hooks/useAuth';
import OfferCard from "../Offer-Card/OfferCard";
import EditModal from "../EditModal/EditModal";
import SortableList, { SortableItem } from 'react-easy-sort'
import arrayMove from 'array-move'
import './Home.css';

const Home = () => {
    const [state, setState] = useState({ page: 1, attribute: 'offerId', query: "" });
    const [data, setData] = useState([]);
    const { auth, setAuth } = useAuth();
    const [errmsg, seterr] = useState({ msg: "" });
    const scroll = useRef();
    const errModal = useRef();
    const editModal = useRef();
    const [edit, setEdit] = useState({ bool: false, offer: "" });

    const fetchData = async () => {
        try {
            scroll.current.scrollIntoView()
            let url = process.env.REACT_APP_URL + `/offer/?page=${state.page}`
            if (state.query) {
                url += `&query=${state.query}&attribute=${state.attribute}`
            }
            const response = await fetch(
                url,
                {
                    headers: {
                        authorization: auth.token
                    }

                }
            )
            const res = await response.json();
            if (res.message === 'jwt expired') {
                setAuth({ token: "", role: "" })
                localStorage.removeItem('auth-token');
                localStorage.removeItem('role');
            }
            setData(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setState({ ...state, page: 1 });
        fetchData()
    }

    const handlePrev = () => {
        if (state.page > 1) {
            setState({ ...state, page: state.page - 1 });
        }
    }

    const handleNext = () => {
        if (data.length !== 0) {
            setState({ ...state, page: state.page + 1 });
        }
    }

    const onSortEnd = (oldIndex, newIndex) => {
        setData((array) => arrayMove(array, oldIndex, newIndex))

    }

    const discardSearch = (e) => {
        e.preventDefault();
        setState({ page: 1, attribute: 'offerId', query: "" });
        fetchData();
    }
    useEffect(() => {
        fetchData()
    }, [state.page]);
    return (
        <main className="main-section">
            <form onSubmit={handleSubmit} ref={scroll}>
                <div className="input-container">
                    <label htmlFor="attribute">Search Attribute</label>
                    <select name="attribute"
                        id="attribute"
                        onChange={(e) => { setState({ ...state, attribute: e.target.value }) }}
                    >
                        <option value="offerId" defaultChecked>Offer Id</option>
                        <option value="offerTitle">Offer Title</option>
                        <option value="offerDescription">Offer Description</option>

                    </select>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        autoComplete="off"
                        required
                        placeholder="Search query"
                        onChange={(e) => { setState({ ...state, query: e.target.value }) }}
                        value={state.query}
                    />
                </div>
                <button className="btn">Search</button>
                <button className="btn" onClick={discardSearch}>Discard Search</button>
            </form>
            {data.length === 0 &&
                <h1 className="message">No Offers To Show</h1>
            }
            <section className="flex-container">
                <SortableList
                    onSortEnd={onSortEnd}
                    className="list"
                    draggedItemClassName="dragged"
                    lockAxis="y"
                    allowDrag={true}>
                    {
                        data.map((offer, index) => {
                            return <SortableItem key={index}><div className="item"><OfferCard offer={offer} key={index} fetchData={fetchData} seterr={seterr} errModal={errModal} setEdit={setEdit} /></div></SortableItem>
                        })
                    }
                </SortableList>
            </section>
            <section className="pagination-btns">
                <button
                    className="btn"
                    onClick={handlePrev}
                    disabled={state.page === 1 ? true : false}
                >Prev</button>
                <button
                    className="btn"
                    onClick={handleNext}
                    disabled={data.length === 0 ? true : false}
                >Next</button>
            </section>
            <div ref={errModal} className="error-modal">
                <h1 className={errmsg.class}> {errmsg.msg}</h1>
                <button
                    className="btn"
                    onClick={() => { errModal.current.style.top = '-300px' }}
                >OK</button>
            </div>
            {edit.bool && <div ref={editModal} className="edit-modal">
                <EditModal offer={edit.offer} setEdit={setEdit} errModal={errModal} setError={seterr} fetchData={fetchData} />
            </div>}
        </main>
    )
}
export default Home