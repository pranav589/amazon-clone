import React, { useContext ,useEffect} from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import '../../../styles/orderHistory.css'
import axios from 'axios'

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history,setHistory] = state.userAPI.history;
  const [isAdmin]=state.userAPI.isAdmin
  const [token]=state.token


  useEffect(()=>{
    if(token){
        const getHistory=async()=>{
            if(isAdmin){
                const res=await axios.get('/api/payment',{
                    headers:{Authorization:token}
                })
                setHistory(res.data)
            }else{
                const res=await axios.get('/user/history',{
                    headers:{Authorization:token}
                })
                setHistory(res.data)
            }
            
            
        }
        getHistory()
    }
},[token,isAdmin,setHistory])

  return (
    <div className="history__page">
      <h2>History</h2>
      <h4>You have {history.length} products ordered.</h4>

      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date of purchase</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {history.map((item) => {
              <tr key={item._id}>
                <td>{item.paymentID}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/history/${item._id}`}>View</Link>
                </td>
              </tr>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
