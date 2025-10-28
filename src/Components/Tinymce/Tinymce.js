import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

function Tinymce({
  content,
  handleEditorChange,
  height = 300,
  name,
  initialValue,
  auto_focus = false,
}) {
  return (
    <Editor
      textareaName={name}
      tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
      initialValue={initialValue}
      value={content}
      init={{
        height,
        auto_focus,
        menubar: false,
        browser_spellcheck: true,
        // fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
        plugins: [
          'advlist autolink lists link charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect |' +
          'bold italic backcolor forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist table numlist outdent indent | ' +
          'removeformat | help',
      }}
      onEditorChange={handleEditorChange}
    />
  );
}

export default Tinymce;
