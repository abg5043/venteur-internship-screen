import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import ZipPane from './ZipPane';
import CountyPane from './CountyPane';
import UserInfoPane from './UserInfoPane';
import PolicyPane from './PolicyPane';

function App() {
  const [zipId, setZipId] = useState();
  const [policies, setPolicies] = useState();
  const [gender, setGender] = useState('');
  const [smoker, setSmoker] = useState('');
  const [age, setAge] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);
  const [failAlert, setFailAlert] = useState(false);

  // Conditionally renders an alert on successful enrollment
  const renderAlert = () => {
    if (successAlert) {
      return (
        <Alert severity="success" onClose={() => { setSuccessAlert(false); }}>You are enrolled!</Alert>
      );
    } if (failAlert) {
      return (
        <Alert severity="error" onClose={() => { setFailAlert(false); }}>Something went wrong, please contact customer service.</Alert>
      );
    }
    return null;
  };

  // Conditionally renders the user's views
  const renderElements = () => {
    // If users haven't generated any policies, they start here
    if (policies === undefined) {
      if (zipId === undefined) {
        // First pane users see to enter zip code
        return <ZipPane setZipId={setZipId} />;
      } if (zipId.length > 1) {
        // If their zip code returns more than one zip code, show them this
        return <CountyPane setZipId={setZipId} zipId={zipId} />;
      }
      // Third pane allows users to enter the last of their info & generate policies to enroll in
      return (
        <UserInfoPane
          zipId={zipId}
          setPolicies={setPolicies}
          age={age}
          setAge={setAge}
          gender={gender}
          setGender={setGender}
          smoker={smoker}
          setSmoker={setSmoker}
        />
      );
    }
    // Users see policies and choose from one here
    return (
      <PolicyPane
        policies={policies}
        zipId={zipId}
        age={age}
        gender={gender}
        smoker={smoker}
        setSuccessAlert={setSuccessAlert}
        setFailAlert={setFailAlert}
      />
    );
  };

  return (
    <div>
      {renderAlert()}
      <Typography gutterBottom variant="h4">
        Venteur Technical Screen
      </Typography>
      {renderElements()}
    </div>
  );
}

export default App;
