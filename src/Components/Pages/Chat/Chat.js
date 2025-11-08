import React, { useEffect, useRef, useState } from 'react'
import Layout from '../Layout/Layout'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import Tinymce from '../../Tinymce/Tinymce';
import toast from 'react-hot-toast';
import request from '../../../api/api';

function Chat() {
    const [content, setContent] = useState(
    '<h1>Document Title</h1><p>Click the Edit button to start editing this document. This is your A4-sized document editor with a professional look and feel.</p><p>You can add formatted text, lists, and more using the rich text editor.</p>'
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [tempContent, setTempContent] = useState(content);
  const editorRef = useRef(null);

  const fetchGeminiContent =()=>{
    request({
        url:'/admin/get/gemini/content',
        method:'POST',
        data:{
            settingId:'gemini-details'
        }
    }).then((res)=>{
        if(res.status===1){
            setContent(res?.content?.content)
        }
        if(res.status===0){
            toast.error(res.message)
        }
    }).catch((err)=>{
        console.log(err)
    })
  }

  useEffect(()=>{
    fetchGeminiContent()
  },[])


  const toggleModal = () => {
    if (!modalOpen) {
      setTempContent(content);
    }
    setModalOpen(!modalOpen);
  };

  const handleSave = () => {
      if(tempContent===""){
        return toast.error("Content should not be Empty")
      }

      request({
        url:'/admin/update/gemini/content',
        method:"POST",
        data:{
            settingId:'gemini-details',
            content:tempContent
        }
      }).then((res)=>{
        setContent(tempContent);
        setModalOpen(false);
        fetchGeminiContent()
      }).catch((err)=>{
        console.log(err)
      })
  };

  const handleCancel = () => {
    setTempContent(content);
    setModalOpen(false);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <Layout>
       <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button
            onClick={toggleModal}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              fontSize: '16px',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Edit Document
          </button>
        </div>

        <div
          style={{
            width: '210mm',
            minHeight: '297mm',
            maxHeight: '297mm',
            margin: '0 auto',
            backgroundColor: 'white',
            boxShadow: '0 0 20px rgba(0,0,0,0.15)',
            padding: '25mm 20mm',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <Modal isOpen={modalOpen} size='lg' toggle={()=>toggleModal()}>
        <ModalHeader toggle={()=>toggleModal()}>Edit Chat Data</ModalHeader>
        <ModalBody>
            <div className=''>
                          <Tinymce
                              content={tempContent}
                              handleEditorChange={(content) =>
                                  setTempContent(content)
                              }
                          />
            </div>
            <div style={{
              padding: '20px',
              borderTop: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
        </ModalBody>
      </Modal>
    </div>
    </Layout>
  )
}

export default Chat

const toolbarButtonStyle = {
  backgroundColor: 'white',
  border: '1px solid #ced4da',
  padding: '6px 12px',
  cursor: 'pointer',
  borderRadius: '3px',
  fontSize: '14px',
  minWidth: '32px',
  transition: 'background-color 0.2s'
};