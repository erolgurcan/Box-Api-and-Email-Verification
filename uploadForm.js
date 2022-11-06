import { useState, React } from "react";
import axios from "axios";
import FileSaver from "file-saver";
const token = "";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState();
  const [email, setEmail] = useState();
  const [token, setToken] = useState();
  const [code, setCode] = useState();
  const [isAuth, setIsAuth] = useState(false);

  const onClickHandler = () => {
    const data = new FormData();
    const fileToUpload = document.getElementById("file").files[0];
   

    data.append("file", fileToUpload);
    data.append(
      "attributes",
      JSON.stringify({
        name: "test2",
        parent: {
          id: "180482645802",
        },
      })
    );

    axios
      .post("https://upload.box.com/api/2.0/files/content", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onLinkHandler = (id) => {
    axios
      .get("https://api.box.com/2.0/folders/180482645802/items", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log(res.data.entries);
        setFilename(res.data.entries);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadHander = (id  ) => {

    console.log(id);
    axios
      .get(`https://api.box.com/2.0/files/${id}/content`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        responseType: "blob",
      })
      .then((res) => {
        console.log(res);

        const blob = new Blob([res.data], { type: "application/pdf" });
        FileSaver.saveAs(blob, "filename.pdf");
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const onClickMailSender = (e) => {

    console.log(email)
    axios
      .post("http://localhost:1992/api/mentorApplication/apply",
        {email: email},
      ).then((res) => {
        console.log(res)
        setToken(res.data.token)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const onClickVerifyHandler =( ) => {

    axios.get(
      "http://localhost:1992/api/mentorApplication/apply/verify",
      {
        headers: {
          "token": token,
          "code": code
      }
      }
    ).then((res) => {
      console.log(res)
      if(res.status===200){
        setIsAuth(true)
      }
    })
    } 

  

  return (
    <div>

        <div>
          <h5>Email Verification</h5>
          <input onChange= { () => {
            setEmail(document.getElementById("email").value);
            console.log(email)
          }} type= "email" id = "email" placeholder="Enter Email" />
          <button onClick= {
          onClickMailSender
          } >Send Verification Code</button>
        </div>

        <div>
          <h5>Enter Verification Code</h5>
          <input  onChange = {
            () => {
              setCode(document.getElementById("code").value)
            }
          } id = "code" type= "text" placeholder="Enter Code" />
          <button onClick = {
            () => {
              onClickVerifyHandler()
          } }> Verify </button>
        </div>

        <div>
          <h5>Authorization</h5>
          {
            isAuth && <h5 style={{"color": "Green"}} >Authorized</h5>
          }
        </div>


      <div>
        <input id="file" type="file"></input>
        <button onClick={onClickHandler}> Upload! </button>
      </div>

      <h3>List All Resumes</h3>
      <button onClick={onLinkHandler}>Click</button>
      <div>
        <ul>
          {filename &&
            filename.map((file, id) => (
              <li key={id}>
                <a onClick={
                  () => downloadHander(file.id)

                }  id = {file.id} >{file.name}</a>
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h3>Download Resume</h3>
        <button onClick={downloadHander}>Click</button>
      </div>

      <div>

      </div>
    </div>
  );
};

export default UploadForm;
