import React from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Keyboard,
} from 'react-native';
import { BachSVG, SearchSVG } from './AllSVG';

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#b6b6b6',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  searchBarInput: {
    flex: 1,
    fontWeight: 'normal',

    backgroundColor: 'transparent',
  },
});

export default class SearchBar extends React.PureComponent {

  static propTypes = {
    height: PropTypes.number.isRequired,
    autoCorrect: PropTypes.bool,
    returnKeyType: PropTypes.string,
    onSearchChange: PropTypes.func,
    onEndEditing: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    placeholder: PropTypes.string,
    padding: PropTypes.number,
    inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    iconCloseComponent: PropTypes.object,
    iconSearchComponent: PropTypes.object,
    iconBackComponent: PropTypes.object,
    iconCloseName: PropTypes.string,
    iconSearchName: PropTypes.string,
    iconBackName: PropTypes.string,
    placeholderColor: PropTypes.string,
    iconColor: PropTypes.string,
    textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    inputProps: PropTypes.object,
    onBackPress: PropTypes.func,
    alwaysShowBackButton: PropTypes.bool,
    isDark: PropTypes.bool,
  };

  static defaultProps = {
    onSearchChange: () => { },
    onEndEditing: () => { },
    onSubmitEditing: () => { },
    inputStyle: {},
    iconCloseName: 'md-close',
    iconSearchName: 'md-search',
    iconBackName: 'md-arrow-back',
    placeholder: 'Search...',
    returnKeyType: 'search',
    padding: 5,
    placeholderColor: '#bdbdbd',
    iconColor: '#737373',
    textStyle: {},
    alwaysShowBackButton: false,
    searchValue: '',
    isDark: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOnFocus: false,
      wait: true,
      searchValue: props.searchValue,
    };
    this._onSearchChange = this._onSearchChange.bind(this);
    this._onClear = this._onClear.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  _onSearchChange(searchValue) {
    this.setState({ searchValue });
    this.props.onSearchChange && this.props.onSearchChange(searchValue);
  }

  _onClear() {
    this._onSearchChange('');
    this.props.onClear && this.props.onClear();
  }

  _onFocus() {
    this.setState({ isOnFocus: true });
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  _onBlur() {
    this.setState({ isOnFocus: false });
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    Keyboard.dismiss();
  }

  _backPressed() {
    Keyboard.dismiss();
    if (this.props.onBackPress) {
      this.props.onBackPress();
    }
  }

  setText(text, focus) {
    this._textInput.setNativeProps({ text: text });
    if (focus) {
      this._onFocus();
    }
  }

  render() {
    const {
      height,
      autoCorrect,
      returnKeyType,
      placeholder,
      padding,
      inputStyle,
      iconColor,
      iconCloseComponent,
      iconSearchComponent,
      iconBackComponent,
      iconBackName,
      iconSearchName,
      iconCloseName,
      placeholderColor,
      textStyle,
      isDark
    } = this.props;

    let { iconSize, iconPadding } = this.props;

    iconSize = typeof iconSize !== 'undefined' ? iconSize : height * 0.5;
    iconPadding =
      typeof iconPadding !== 'undefined' ? iconPadding : height * 0.25;
    // console.log('SearchBar')
    return (
      <View
        // onStartShouldSetResponder={Keyboard.dismiss}
        style={{ padding: padding }}>
        <View
          style={[
            styles.searchBar,
            {
              height: height,
              paddingLeft: iconPadding,
            },
            inputStyle,
          ]}>
          {this.state.isOnFocus || this.props.alwaysShowBackButton ? (
            <TouchableOpacity onPress={this._backPressed.bind(this)}>
              {iconBackComponent ? (
                iconBackComponent
              ) : (
                <BachSVG
                  width={25}
                  height={25}
                  fill={isDark ? '#dcdcdc' : '#212121'}
                />
              )}
            </TouchableOpacity>
          ) : iconSearchComponent ? (
            iconSearchComponent
          ) : (
            <SearchSVG
              width={25}
              height={25}
              fill={isDark ? '#dcdcdc' : '#212121'}
            />
          )}
          <TextInput
            value={this.state.searchValue}
            autoCorrect={autoCorrect === true}
            ref={c => (this._textInput = c)}
            returnKeyType={returnKeyType}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            onChangeText={this._onSearchChange}
            onEndEditing={this.props.onEndEditing}
            onSubmitEditing={this.props.onSubmitEditing}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            underlineColorAndroid="transparent"
            style={[
              styles.searchBarInput,
              {
                color: isDark ? '#dcdcdc' : '#212121',
                paddingLeft: iconPadding,
                fontSize: height * 0.4,
              },
              textStyle,
            ]}
            {...this.props.inputProps}
          />
          {this.state.isOnFocus ? (
            <TouchableOpacity onPress={this._onClear}>
              {iconCloseComponent ? (
                iconCloseComponent
              ) : (
                <Text
                  style={{
                    color: isDark ? '#fff' : '#000',
                    fontSize: 18,
                    paddingHorizontal: 8,
                    marginRight: 6,
                    fontWeight: 'bold',
                  }}>
                  ✕
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
