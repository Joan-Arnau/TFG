import EventListBase from '../components/common/EventListBase';

const FestivalScreen = ({ navigation }) => {
  return <EventListBase navigation={navigation} isFestivalOnly={true} />;
};

export default FestivalScreen;
