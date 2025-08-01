"use client";

import { useMemo } from 'react';
import Select, { StylesConfig, GroupBase, SingleValue, MultiValue, ActionMeta } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isSearchable?: boolean;
  isMulti?: boolean;
  className?: string;
  isError?: boolean;
  isDisabled?: boolean;
  instanceId?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Choose",
  isSearchable = true,
  isMulti = false,
  className = "",
  isError = false,
  isDisabled = false,
  instanceId,
}: CustomSelectProps) {
  const selectedOption = options.find(option => option.value === value) || null;
  
  // Generate a stable instanceId to prevent hydration mismatches
  const stableInstanceId = useMemo(() => {
    if (instanceId) return instanceId;
    // Use a stable fallback ID
    return `custom-select-${placeholder.replace(/\s+/g, '-').toLowerCase()}`;
  }, [instanceId, placeholder]);

  const customStyles: StylesConfig<Option, boolean, GroupBase<Option>> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      border: isError 
        ? '2px solid #dc3545' 
        : state.isFocused 
        ? '2px solid #da9305' 
        : '2px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: state.isFocused 
        ? isError 
          ? '0 0 0 3px rgba(220, 53, 69, 0.1)' 
          : '0 0 0 3px rgba(210, 105, 30, 0.1)'
        : 'none',
      fontSize: '14px',
      backgroundColor: isDisabled ? '#f8f9fa' : 'white',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      '&:hover': {
        borderColor: isError ? '#dc3545' : '#da9305',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999',
      fontSize: '14px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
      fontSize: '14px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#da9305'
        : state.isFocused
        ? '#fff3e0'
        : 'white',
      color: state.isSelected ? 'white' : '#333',
      fontSize: '14px',
      padding: '12px 16px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? '#da9305' : '#fff3e0',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e0e0e0',
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px 0',
      maxHeight: '200px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: '#666',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s',
      '&:hover': {
        color: '#da9305',
      },
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: '#da9305',
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: '#666',
      fontSize: '14px',
      padding: '12px 16px',
    }),
  };

  const handleChange = (
    newValue: SingleValue<Option> | MultiValue<Option>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _actionMeta: ActionMeta<Option>
  ) => {
    // Handle single value selection (our use case)
    if (newValue && !Array.isArray(newValue)) {
      onChange((newValue as Option).value);
    } else {
      onChange('');
    }
  };

  return (
    <Select
      instanceId={stableInstanceId}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isMulti={isMulti}
      isDisabled={isDisabled}
      className={className}
      styles={customStyles}
      noOptionsMessage={() => "No options found"}
      loadingMessage={() => "Loading..."}
      isClearable={false}
      menuPlacement="auto"
      menuPosition="fixed"
    />
  );
}