import React, { useState, useContext,useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Spinner from "../../shared/Spinner";
import "../../../styles/createProduct.css";
import {useHistory,useParams} from 'react-router-dom'


const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "",
  content:"",
  category: "",
  _id:""
};

function CreateProduct() {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const history=useHistory()
  const params=useParams()
  const[products]=state.productsAPI.products
  const [onEdit,setOnEdit]=useState(false)
  const [callback,setCallback]=state.productsAPI.callback

  useEffect(()=>{
    if(params.id){
      setOnEdit(true)
      products.forEach(product=>{
        if(product._id===params.id){
          setProduct(product)
          setImages(product.images)
        }
      })
      
    }else{
      setProduct(initialState)
      setImages(false)
      setOnEdit(false)
    }
  },[params.id,products])

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You are not an admin!");
      const file = e.target.files[0];
      if (!file) return alert("File not exist.");

      if (file.size > 1024 * 1024) return alert("File size is too large.");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("File format not supported.");

      let formData = new FormData();

      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };


  const handleDestroy=async ()=>{
    try {
      if(!isAdmin) return alert("You are not an admin!")
      setLoading(true)
      await axios.post('/api/deleteItem',{public_id:images.public_id},{
        headers:{Authorization:token}
      })
      setLoading(false)
      setImages(false)

    } catch (err) {
      alert(err.response.data.msg)
    }
  }

  const handleInputChange=e=>{
    const {name,value}=e.target
    setProduct({...product,[name]:value})
  }

  const handleSubmit=async e=>{
    e.preventDefault()
    try {
      if(!isAdmin) return alert("You are not an admin!")
      if(!images) return alert("No image uploaded!")
      if(onEdit){
        await axios.put(`/api/products/${product._id}`,{...product,images},{
          headers:{Authorization:token}
        })
      }else{
        await axios.post('/api/products',{...product,images},{
          headers:{Authorization:token}
        })
      }
      setCallback(!callback)
      setImages(false)
      setProduct(initialState)
      history.push('/')
    } catch (err) {
      return alert(err.response.data.msg)
    }
  }

  return (
    <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {loading ? (
          <div id="file_img">
            <Spinner />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form action="" onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="product_id">Product ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            value={product.product_id}
            onChange={handleInputChange}
            disabled={onEdit}
          />
        </div>

        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={product.title}
            onChange={handleInputChange}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="row">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            value={product.description}
            onChange={handleInputChange}
            rows="5"
          />
        </div>

        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea
            type="text"
            name="content"
            id="content"
            required
            value={product.content}
            onChange={handleInputChange}
            rows="9"
          />
        </div>

        <div className="row">
          <label htmlFor="categories">Categories: </label>
          <select name="category" id="category" value={product.category}  onChange={handleInputChange}>
            <option value="">Please Select A Category</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{onEdit ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
