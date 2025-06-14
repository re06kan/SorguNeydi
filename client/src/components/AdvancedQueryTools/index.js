import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Alert,
  Button
} from '@mui/material';
import JoinBuilder from '../JoinBuilder';
import GroupByBuilder from '../GroupByBuilder';
import OrderByBuilder from '../OrderByBuilder';
import AggregateFunctions from '../AggregateFunctions';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdvancedQueryTools = ({
  joins,
  onJoinsChange,
  tables,
  tableColumns,
  fetchTableColumns,
  updateQueryWithJoins,
  // İleri düzey fonksiyonlar
  updateQueryWithGroupBy,
  updateQueryWithOrderBy,
  updateQueryWithFunctions,
  // İleri düzey state'ler
  groupByColumns,
  onGroupByChange,
  orderByColumns,
  onOrderByChange,
  functionExpressions,
  onFunctionExpressionsChange
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [showFeatureAlert, setShowFeatureAlert] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFeatureClick = (feature) => {
    setFeatureMessage(`${feature} özelliği yakında eklenecektir. Şu anda sadece tablo birleştirme (JOIN) özelliği tam olarak uygulanmıştır.`);
    setShowFeatureAlert(true);
    setTimeout(() => {
      setShowFeatureAlert(false);
    }, 3000);
  };

  return (
    <Paper sx={{ mb: 1, position: 'relative' }}>
      {showFeatureAlert && (
        <Alert
          severity="info"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            width: '80%',
            boxShadow: 3
          }}
          onClose={() => setShowFeatureAlert(false)}
        >
          {featureMessage}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="query tools tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Tablo Birleştirme (JOIN)" />
          <Tab label="Gruplama (GROUP BY)" />
          <Tab label="Sıralama (ORDER BY)" />
          <Tab label="Fonksiyonlar" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <JoinBuilder
          joins={joins}
          tables={tables}
          tableColumns={tableColumns}
          onJoinsChange={onJoinsChange}
          fetchTableColumns={fetchTableColumns}
          updateQueryWithJoins={updateQueryWithJoins}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GroupByBuilder
          groupByColumns={groupByColumns}
          onGroupByChange={onGroupByChange}
          tables={tables}
          tableColumns={tableColumns}
          fetchTableColumns={fetchTableColumns}
          updateQueryWithGroupBy={updateQueryWithGroupBy}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <OrderByBuilder
          orderByColumns={orderByColumns}
          onOrderByChange={onOrderByChange}
          tables={tables}
          tableColumns={tableColumns}
          fetchTableColumns={fetchTableColumns}
          updateQueryWithOrderBy={updateQueryWithOrderBy}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <AggregateFunctions
          functionExpressions={functionExpressions}
          setFunctionExpressions={onFunctionExpressionsChange}
          tables={tables}
          tableColumns={tableColumns}
          fetchTableColumns={fetchTableColumns}
          updateQueryWithFunctions={updateQueryWithFunctions}
        />
      </TabPanel>
    </Paper>
  );
};

export default AdvancedQueryTools;
