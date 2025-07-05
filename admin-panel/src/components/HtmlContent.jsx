
import React  from 'react';

const HtmlContent = ({ content }) => {
 
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
export default HtmlContent