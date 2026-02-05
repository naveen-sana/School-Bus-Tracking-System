import React from "react";
import MainNav from "./MainNav";
import axios from "axios";
import {toast} from "react-toastify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateLocation = () => {
  const [data, setData] = useState({});
  const params = useParams();
  const getBus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/bus/` + params.id
      );

      setData(res.data)


      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getBus();
  }, []);

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };
  const handleClick =async(e) => {
    e.preventDefault();
    try{
    const res=await axios.patch(`http://localhost:8080/api/v1/bus/` +params.id,data)
    console.log(res.data,"updated bus")
    toast.success("Location updated Successfully", {});

  }catch(err){
    console.log(err)
    toast.error(err.response.data.msg, {});

  }
  
}

  return (
    <div>
      <MainNav />
      <div className="driverbg">
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-sm-3">
            <div className="card mt-5">
              <h4 className="card-header text-primary">Enter the Location</h4>
              <div className="card-body">
                <input
                  className="form-control"
                  type="text"
                  name="location"
                  value={data.location}
                  onChange={handleChange}
                  placeholder="Location"
                  aria-label="default input example"
                />
                <button className="btn btn-primary mt-2" onClick={handleClick}>Update</button>
              </div>
              <i className="fas fa-thunderstorm" />
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLocation;
