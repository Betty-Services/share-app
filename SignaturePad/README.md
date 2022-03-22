# Signature pad component

With this component you can create a signature pad that allows users to draw a signature and save it as an image within the BettyBlocks application
The component makes uses of an external libary 'react-signature-canvas'. In order to get this component working you must add the package to your bundle file.

You can use the bundle file within the bundle folder for demo use.

## How to use

1. Place the signature component within a form component so that the signature can be send with the form submit.
![image](https://user-images.githubusercontent.com/58258518/159506157-3164bee6-5561-4566-9c18-1d3923eefff9.png)

2. If needed to can make use of the 'clearsignature' interaction to create a reset button the the enduser.
![image](https://user-images.githubusercontent.com/58258518/159506370-1cc2bf58-582b-471f-b168-0e89859d199a.png)

3. When submitting the form, a base64 string will be send. Make sure that the custom model is able to handle this input type. You can use a text property for this.

4. Within the action you must create an url expression variable the will convert the base64 string into an image. 
For exmaple: 'base64_decode(var:form_data.place_signature, "file", "signature.jpg")' 

5. Assign the url expressions variable to an image / file proerty to store the signature within your app.
![image](https://user-images.githubusercontent.com/58258518/159507114-f052693d-1daf-42d3-8184-b1321be3edb2.png)

