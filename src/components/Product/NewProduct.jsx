import React, { Component } from 'react';
import { Segment, Form, Radio, Button, Image, Header } from 'semantic-ui-react';
import { PhotoPicker } from 'aws-amplify-react';
import { Storage, Auth, API, graphqlOperation } from 'aws-amplify';

import awsmobile from '../../aws-exports';
import { createProduct } from '../../graphql/mutations';
import { convertToCents } from '../../shared';

const initialState = {
  description: '',
  price: '',
  shipped: true,
  imagePreview: '',
  image: null,
  isUploading: false
};

class NewProduct extends Component {
  state = { ...initialState };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleRadioButton = (e, { name, value }) => {
    if (value === 'true') {
      this.setState({ [name]: true });
    } else {
      this.setState({ [name]: false });
    }
  };

  handleSubmit = async () => {
    const { image, description, price, shipped } = this.state;
    const { marketId } = this.props;
    // event.preventDefault();
    // console.log(this.state);
    try {
      this.setState({ isUploading: true });

      const visibility = 'public';
      const { identityId } = await Auth.currentCredentials();
      const filename = `/${visibility}/${identityId}/${Date.now()}-${image.name}`;

      const uploadedFile = await Storage.put(filename, image.file, {
        contentType: image.type,
        level: 'public'
      });
      console.log('uploadedFile:', uploadedFile);

      const file = {
        bucket: awsmobile.aws_user_files_s3_bucket,
        region: awsmobile.aws_project_region,
        key: uploadedFile.key
      };

      const input = {
        productMarketId: marketId,
        description,
        price: convertToCents(price),
        shipped,
        file
      };

      const result = await API.graphql(graphqlOperation(createProduct, { input }));
      console.log('result:', result);
      this.setState({ ...initialState });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { description, price, shipped, imagePreview, image, isUploading } = this.state;

    return (
      <Segment attached='bottom' textAlign='center'>
        <Header as='h3' color='teal'>
          <Header.Content>Add new Product</Header.Content>
        </Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className='form-description'>
            <Form.Input
              className='form-description'
              required
              label='Add product description'
              placeholder='Product description'
              name='description'
              value={description}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              label='Set product price'
              type='number'
              placeholder='Price'
              name='price'
              value={price}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group inline>
            <label>Shipped or Emailed?</label>
            <Form.Field
              control={Radio}
              label='Shipped'
              value='true'
              name='shipped'
              checked={shipped === true}
              onChange={this.handleRadioButton}
            />
            <Form.Field
              control={Radio}
              label='Emailed'
              value='false'
              name='shipped'
              checked={shipped === false}
              onChange={this.handleRadioButton}
            />
          </Form.Group>
          {imagePreview && <Image src={imagePreview} size='small' centered />}
          <PhotoPicker
            title='Product Image'
            preview='hidden'
            onLoad={url => this.setState({ imagePreview: url })}
            onPick={file => this.setState({ image: file })}
            theme={{
              formContainer: {
                margin: 0,
                padding: '0.4em',
                textAlign: 'center'
              },
              formSection: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none'
              },
              sectionBody: {
                margin: 0,
                width: '230px'
              },
              photoPickerButton: {
                display: 'none'
              }
            }}
          />
          <Button disabled={!image || isUploading} color='teal' loading={isUploading}>
            Submit
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default NewProduct;

//#region Hooks
// class NewProduct extends Component {
//   const [form, setForm] = useState({
//     description: '',
//     price: null,
//     shipped: true
//   });

//   const handleChange = (e, { name, value }) => {
//     console.log('name:', name);
//     console.log('value:', value);
//     setForm({ ...form, [name]: value });
//   };

//   return (
//     <Segment attached='bottom'>
//       <Form>
//         <Form.Group>
//           <Form.Input
//             label='Add product description'
//             placeholder='Product description'
//             name='description'
//             value={form.description}
//             onChange={handleChange}
//           />
//         </Form.Group>
//         <Form.Group inline>
//           <label>Shipped or Emailed?</label>
//           <Form.Field
//             control={Radio}
//             label='Shipped'
//             value='true'
//             name='shipped'
//             checked={form.shipped === true}
//             onChange={handleChange}
//             />
//           <Form.Field
//             defaultChecked
//             control={Radio}
//             label={form.shipped}
//             value='false'
//             name='shipped'
//             checked={form.shipped === false}
//             onChange={handleChange}
//           />
//           {form.shipped}
//         </Form.Group>
//       </Form>
//       <strong>onChange:</strong>
//       <pre>{JSON.stringify({ form }, null, 2)}</pre>
//     </Segment>
//   );
// };
//#endregion
