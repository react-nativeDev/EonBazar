import React from 'react';
import {FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {images} from '../assets';
import {Block, CustomButton, ImageComponent, Text} from '../components';
import {light} from '../components/theme/colors';
import {t1, w3} from '../components/theme/fontsize';
const HeaderMenu = ({color, onPress}) => {
  const _renderItem = ({item}) => {
    return (
      <CustomButton
        center
        style={{width: wp(20)}}
        onPress={() => onPress(item.title)}>
        <Block
          color={color === item.title ? light.warning : light.secondary}
          flex={false}
          borderRadius={60}
          center
          middle
          margin={[0, w3]}
          style={{height: 60, width: 60}}>
          <ImageComponent name={item.link} height="40" width="40" />
        </Block>
        <Text
          center
          margin={[hp(0.5), 0, 0, 0]}
          height={16}
          transform="uppercase"
          size={8}>
          {item.title}
        </Text>
      </CustomButton>
    );
  };
  return (
    <Block white margin={[0, w3]} padding={[t1]} flex={false}>
      <FlatList
        contentContainerStyle={flatlistStyle}
        data={[
          {
            link: 'breakfast_range',
            title: 'breakfast range',
          },
          {
            link: 'snacks_range',
            title: 'curry range',
          },
          {
            link: 'curry_range',
            title: 'snacks range',
          },
        ]}
        renderItem={_renderItem}
      />
    </Block>
  );
};
const flatlistStyle = {
  flexDirection: 'row',
};
export default HeaderMenu;
