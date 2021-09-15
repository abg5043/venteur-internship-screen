import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ZipPane from './ZipPane';
import CountyPane from './CountyPane';
import UserInfoPane from './UserInfoPane';
import PolicyPane from './PolicyPane';

function App() {
  const [zipId, setZipId] = useState();
  const [policies, setPolicies] = useState();
  const [gender, setGender] = useState();
  const [smoker, setSmoker] = useState();
  const [age, setAge] = useState();

  const renderElements = () => {
    if (policies === undefined) {
      if (zipId === undefined) {
        return <ZipPane setZipId={setZipId} />;
      } if (zipId.length > 1) {
        return <CountyPane setZipId={setZipId} zipId={zipId} />;
      }
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
    return (
      <PolicyPane
        policies={policies}
        zipId={zipId}
        age={age}
        gender={gender}
        smoker={smoker}
      />
    );
  };

  return (
    <div>
      <Typography gutterBottom variant="h4">
        Venteur Technical Screen
      </Typography>
      {renderElements()}
    </div>
  );
}

export default App;
