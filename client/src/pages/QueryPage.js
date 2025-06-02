import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Button, TextField, Box,
  Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  List, ListItem, ListItemText, Accordion, AccordionSummary,
  AccordionDetails, Grid, FormControl, InputLabel, Select, MenuItem,
  IconButton, Menu, Tooltip, TablePagination
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';

// Servisler ve hooks
import { connectionService, schemaService, queryService } from '../services/api';
import FilterCondition from '../components/FilterCondition';
import AdvancedQueryTools from '../components/AdvancedQueryTools';

const QueryPage = () => {
  // State tanımlamaları
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableColumns, setTableColumns] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState('');

  // Filtreleme için yeni state'ler
  const [filterConditions, setFilterConditions] = useState([]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  // Join işlemleri için state
  const [joins, setJoins] = useState([]);

  // Gruplama işlemleri için state
  const [groupByColumns, setGroupByColumns] = useState([]);

  // Sıralama işlemleri için state
  const [orderByColumns, setOrderByColumns] = useState([]);

  // Sayfalama için state'ler
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Bağlantıları yükle
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await connectionService.getAllConnections();
        setConnections(data);

        // Eğer en az bir bağlantı varsa, ilk bağlantıyı seç
        if (data.length > 0) {
          setSelectedConnection(data[0].id);
          fetchTablesForConnection(data[0].id);
        }
      } catch (err) {
        console.error('Bağlantılar yüklenirken hata oluştu:', err);
        setError('Bağlantılar yüklenirken hata oluştu');
      }
    };

    fetchConnections();
  }, []);

  // Bağlantı değiştiğinde tabloları yükle
  const fetchTablesForConnection = async (connectionId) => {
    if (!connectionId) return;

    setTables([]);
    setTableColumns({});
    setError(null);

    try {
      // Tabloları getir
      const data = await schemaService.getTables(connectionId);
      setTables(data.map(t => t.table_name));
    } catch (err) {
      console.error('Tablolar yüklenirken hata oluştu:', err);
      setError('Tablolar yüklenirken hata oluştu');
    }
  };

  // Bağlantı değiştiğinde
  const handleConnectionChange = (event) => {
    const connectionId = event.target.value;
    setSelectedConnection(connectionId);
    fetchTablesForConnection(connectionId);
  };

  // Tablo sütunlarını getir
  const fetchTableColumns = async (tableName) => {
    if (tableColumns[tableName]) return; // Zaten yüklenmişse

    try {
      console.log(`Fetching columns for table: ${tableName}`);
      const columns = await schemaService.getTableColumns(tableName, selectedConnection);
      console.log(`Received columns for ${tableName}:`, columns);

      setTableColumns(prev => ({
        ...prev,
        [tableName]: columns
      }));
    } catch (err) {
      console.error('Sütunlar yüklenirken hata oluştu:', err);
    }
  };

  // Sorgu değişikliği
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  // Sorgu çalıştırma
  const handleRunQuery = async () => {
    if (!selectedConnection) {
      setError('Lütfen bir veritabanı bağlantısı seçin');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await queryService.executeQuery(query, selectedConnection);
      setResults(results);
      setPage(0); // Yeni sorgu çalıştırıldığında sayfa numarasını sıfırla
    } catch (err) {
      setError(err.response?.data?.error || 'Sorgu çalıştırılırken bir hata oluştu');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Tabloya sütun ekleme
  const addColumnToQuery = (tableName, columnName) => {
    const columnText = `${tableName}.${columnName}`;

    if (query.includes('SELECT') && query.includes('FROM')) {
      // SELECT ve FROM zaten varsa
      const fromIndex = query.indexOf('FROM');
      const beforeFrom = query.substring(0, fromIndex).trim();
      const afterFrom = query.substring(fromIndex);

      if (beforeFrom.endsWith('*')) {
        // SELECT * varsa, * yerine kolonları ekle
        const newQuery = beforeFrom.replace('*', columnText) + afterFrom;
        setQuery(newQuery);
      } else {
        // Zaten kolonlar varsa, virgül ile ekle
        setQuery(`${beforeFrom}, ${columnText} ${afterFrom}`);
      }
    } else if (query.includes('SELECT')) {
      // SELECT var ama FROM yoksa
      setQuery(`${query.trim()}, ${columnText} FROM ${tableName}`);
    } else {
      // SELECT bile yoksa, yeni sorgu başlat
      setQuery(`SELECT ${columnText} FROM ${tableName}`);
    }
  };

  // Menüyü aç
  const handleFilterMenuOpen = (event, tableName, columnName, dataType) => {
    event.stopPropagation();
    setFilterMenuAnchor(event.currentTarget);
    setSelectedColumn({
      tableName,
      columnName,
      fullName: `${tableName}.${columnName}`,
      dataType: getDataType(dataType)
    });
  };

  // Menüyü kapat
  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
    setSelectedColumn(null);
  };

  // Veri tipini belirle
  const getDataType = (pgDataType) => {
    if (['integer', 'numeric', 'decimal', 'real', 'double', 'smallint', 'bigint'].includes(pgDataType)) {
      return 'number';
    } else if (['date', 'timestamp', 'time'].includes(pgDataType)) {
      return 'date';
    } else {
      return 'text';
    }
  };

  // Filtre ekle
  const handleAddFilter = () => {
    if (!selectedColumn) return;

    const newCondition = {
      id: uuidv4(),
      column: selectedColumn.fullName,
      columnName: selectedColumn.columnName,
      tableName: selectedColumn.tableName,
      dataType: selectedColumn.dataType,
      operator: '=',
      value: ''
    };

    setFilterConditions([...filterConditions, newCondition]);
    handleFilterMenuClose();

    // Filtreyi WHERE olarak sorguya ekle
    updateQueryWithFilters([...filterConditions, newCondition]);
  };

  // Filtre koşulunu güncelle
  const handleFilterChange = (updatedCondition) => {
    const updatedConditions = filterConditions.map(condition =>
      condition.id === updatedCondition.id ? updatedCondition : condition
    );

    setFilterConditions(updatedConditions);
    updateQueryWithFilters(updatedConditions);
  };

  // Filtre koşulunu kaldır
  const handleFilterRemove = (conditionId) => {
    const updatedConditions = filterConditions.filter(
      condition => condition.id !== conditionId
    );

    setFilterConditions(updatedConditions);
    updateQueryWithFilters(updatedConditions);
  };

  // Filtreleri sorguya ekle
  const updateQueryWithFilters = (conditions) => {
    if (!query || conditions.length === 0) return;

    // WHERE kısmı var mı kontrol et
    const hasWhere = query.toUpperCase().includes('WHERE');
    const whereIndex = hasWhere ? query.toUpperCase().indexOf('WHERE') : -1;

    // Filtre koşullarını oluştur
    const filterClauses = conditions.map(condition => {
      if (['IS NULL', 'IS NOT NULL'].includes(condition.operator)) {
        return `${condition.column} ${condition.operator}`;
      } else if (condition.operator === 'LIKE' || condition.operator === 'NOT LIKE') {
        return `${condition.column} ${condition.operator} '%${condition.value}%'`;
      } else {
        return `${condition.column} ${condition.operator} '${condition.value}'`;
      }
    });

    // Sorguyu güncelle
    let newQuery = query;

    if (hasWhere) {
      // WHERE sonrası group by, order by, vb. varsa koru
      const restOfQuery = query.substring(whereIndex + 5);
      const groupByIndex = restOfQuery.toUpperCase().indexOf('GROUP BY');
      const orderByIndex = restOfQuery.toUpperCase().indexOf('ORDER BY');
      const limitIndex = restOfQuery.toUpperCase().indexOf('LIMIT');

      let cutIndex = restOfQuery.length;
      if (groupByIndex !== -1) cutIndex = Math.min(cutIndex, groupByIndex);
      if (orderByIndex !== -1) cutIndex = Math.min(cutIndex, orderByIndex);
      if (limitIndex !== -1) cutIndex = Math.min(cutIndex, limitIndex);

      const postfix = restOfQuery.substring(cutIndex);
      newQuery = `${query.substring(0, whereIndex + 5)} ${filterClauses.join(' AND ')} ${postfix}`;
    } else {
      // WHERE yoksa ekle
      newQuery = `${query} WHERE ${filterClauses.join(' AND ')}`;
    }

    setQuery(newQuery);
  };

  // Sorguyu JOIN'lerle güncelle
  const updateQueryWithJoins = (joins, isRetry = false) => {
    console.log("updateQueryWithJoins called with:", joins, "isRetry:", isRetry);

    const validJoins = joins.filter(join =>
      join.sourceTable && join.sourceColumn && join.targetTable && join.targetColumn
    );

    if (validJoins.length === 0) {
      console.log("No valid joins found");
      return;
    }

    console.log("Processing valid joins:", validJoins);

    // Eğer sorgu boşsa veya FROM ifadesi yoksa ve bu bir yeniden deneme değilse, yeni bir sorgu oluştur
    if ((!query.trim() || query.toUpperCase().indexOf('FROM') === -1) && !isRetry) {
      console.log("Creating new base query");
      // İlk join ifadesindeki kaynak tabloyu kullan
      const mainTable = validJoins[0].sourceTable;
      const newQuery = `SELECT * FROM ${mainTable}`;
      console.log("Setting new base query:", newQuery);
      setQuery(newQuery);

      // Yeni sorgu oluşturulduktan sonra JOIN'leri eklemek için zamanlayıcı ayarla
      setTimeout(() => {
        console.log("Retrying after timeout with isRetry=true");
        updateQueryWithJoins(validJoins, true);
      }, 500);

      return;
    }

    // JOIN ifadelerini oluştur
    const joinClauses = validJoins
      .map(join => `${join.type} ${join.targetTable} ON ${join.sourceTable}.${join.sourceColumn} = ${join.targetTable}.${join.targetColumn}`);

    console.log("Created join clauses:", joinClauses);

    try {
      // FROM kısmını bul
      const fromIndex = query.toUpperCase().indexOf('FROM');
      if (fromIndex === -1) {
        console.log("FROM not found in query");
        return;
      }

      // FROM sonrası ilk tablo adını al (tüm JOIN ifadelerini kaldırıp temiz başlayacağız)
      const afterFrom = query.substring(fromIndex + 4).trim();

      // İlk kelimeyi tablo adı olarak al (boşluğa kadar)
      const spaceIndex = afterFrom.search(/\s/);
      const tableName = spaceIndex !== -1 ? afterFrom.substring(0, spaceIndex) : afterFrom;

      console.log("Main table name:", tableName);

      // WHERE, GROUP BY, ORDER BY gibi koşulları bul ve koru
      let conditions = '';
      let whereIndex = -1, groupByIndex = -1, orderByIndex = -1;

      // Tüm sorguyu büyük harfe çevir ve indeksleri bul
      const upperQuery = query.toUpperCase();
      whereIndex = upperQuery.indexOf('WHERE');
      groupByIndex = upperQuery.indexOf('GROUP BY');
      orderByIndex = upperQuery.indexOf('ORDER BY');

      if (whereIndex !== -1) {
        conditions = query.substring(whereIndex);
      } else if (groupByIndex !== -1) {
        conditions = query.substring(groupByIndex);
      } else if (orderByIndex !== -1) {
        conditions = query.substring(orderByIndex);
      }

      // Yeni sorguyu oluştur: SELECT kısmı + FROM ana_tablo + JOIN ifadeleri + koşullar
      const selectPart = query.substring(0, fromIndex + 4);
      const newQuery = `${selectPart} ${tableName} ${joinClauses.join(' ')} ${conditions}`.trim();

      console.log("Final query with JOIN:", newQuery);
      setQuery(newQuery);
    } catch (error) {
      console.error("Error updating query with JOINs:", error);
    }
  };

  // GROUP BY ile sorguyu güncelle
  const updateQueryWithGroupBy = (groupByColumns) => {
    if (!query || groupByColumns.length === 0) return;

    // GROUP BY kısmını kontrol et
    const hasGroupBy = query.toUpperCase().includes('GROUP BY');
    const groupByIndex = hasGroupBy ? query.toUpperCase().indexOf('GROUP BY') : -1;

    // GROUP BY ifadelerini oluştur
    const groupByClauses = groupByColumns
      .filter(col => col.table && col.column)
      .map(col => `${col.table}.${col.column}`);

    if (groupByClauses.length === 0) return;

    // Sorguyu güncelle
    let newQuery = query;

    if (hasGroupBy) {
      // GROUP BY sonrası HAVING, ORDER BY varsa koru
      const restOfQuery = query.substring(groupByIndex + 8);
      const havingIndex = restOfQuery.toUpperCase().indexOf('HAVING');
      const orderByIndex = restOfQuery.toUpperCase().indexOf('ORDER BY');

      let cutIndex = restOfQuery.length;
      if (havingIndex !== -1) cutIndex = Math.min(cutIndex, havingIndex);
      if (orderByIndex !== -1) cutIndex = Math.min(cutIndex, orderByIndex);

      const postfix = restOfQuery.substring(cutIndex);
      newQuery = `${query.substring(0, groupByIndex + 8)} ${groupByClauses.join(', ')} ${postfix}`;
    } else {
      // GROUP BY yoksa ekle
      newQuery = `${query} GROUP BY ${groupByClauses.join(', ')}`;
    }

    setQuery(newQuery.trim());
  };

  // ORDER BY ile sorguyu güncelle
  const updateQueryWithOrderBy = (orderByColumns) => {
    if (!query || orderByColumns.length === 0) return;

    // ORDER BY kısmını kontrol et
    const hasOrderBy = query.toUpperCase().includes('ORDER BY');
    const orderByIndex = hasOrderBy ? query.toUpperCase().indexOf('ORDER BY') : -1;

    // ORDER BY ifadelerini oluştur
    const orderByClauses = orderByColumns
      .filter(col => col.table && col.column)
      .map(col => `${col.table}.${col.column} ${col.direction}`);

    if (orderByClauses.length === 0) return;

    // Sorguyu güncelle
    let newQuery = query;

    if (hasOrderBy) {
      // ORDER BY sonrası LIMIT varsa koru
      const restOfQuery = query.substring(orderByIndex + 8);
      const limitIndex = restOfQuery.toUpperCase().indexOf('LIMIT');

      let cutIndex = restOfQuery.length;
      if (limitIndex !== -1) cutIndex = Math.min(cutIndex, limitIndex);

      const postfix = restOfQuery.substring(cutIndex);
      newQuery = `${query.substring(0, orderByIndex + 8)} ${orderByClauses.join(', ')} ${postfix}`;
    } else {
      // ORDER BY yoksa ekle
      newQuery = `${query} ORDER BY ${orderByClauses.join(', ')}`;
    }

    setQuery(newQuery.trim());
  };

  // Fonksiyonlar ile sorguyu güncelle
  const updateQueryWithFunctions = (functionExpressions) => {
    if (!query || functionExpressions.length === 0) return;

    // Sorgunun SELECT kısmını bul
    const selectIndex = query.toUpperCase().indexOf('SELECT');
    const fromIndex = query.toUpperCase().indexOf('FROM');

    if (selectIndex === -1 || fromIndex === -1) return;

    // Mevcut SELECT ifadelerini analiz et
    const currentSelectClause = query.substring(selectIndex + 6, fromIndex).trim();
    const hasSelectAll = currentSelectClause === '*';

    // Fonksiyon ifadelerini oluştur
    const functionClauses = functionExpressions
      .filter(func => func.functionType && (func.functionType === 'COUNT' || (func.table && func.column)))
      .map(func => {
        let expr = '';

        if (func.functionType === 'COUNT' && !func.column) {
          expr = 'COUNT(*)';
        } else {
          expr = `${func.functionType}(${func.table}.${func.column})`;
        }

        if (func.alias) {
          expr += ` AS ${func.alias}`;
        }

        return expr;
      });

    // Yeni SELECT kısmını oluştur
    let newSelectClause = '';

    if (hasSelectAll) {
      // * yerine fonksiyonları ekle
      newSelectClause = functionClauses.join(', ');
    } else {
      // Mevcut sütunlara fonksiyonları ekle
      newSelectClause = `${currentSelectClause}, ${functionClauses.join(', ')}`;
    }

    // Sorguyu güncelle
    const newQuery = `SELECT ${newSelectClause} ${query.substring(fromIndex)}`;
    setQuery(newQuery);
  };

  // Sayfa değiştiğinde
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Sayfa başına satır sayısı değiştiğinde
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="connection-select-label">Veritabanı Bağlantısı</InputLabel>
            <Select
              labelId="connection-select-label"
              id="connection-select"
              value={selectedConnection}
              label="Veritabanı Bağlantısı"
              onChange={handleConnectionChange}
            >
              {connections.map((conn) => (
                <MenuItem key={conn.id} value={conn.id}>
                  {conn.name} ({conn.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Tablolar ve Sütunlar
          </Typography>

          {tables.length > 0 ? (
            <List>
              {tables.map((tableName) => (
                <Accordion key={tableName}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => fetchTableColumns(tableName)}>
                    <Typography>{tableName}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {tableColumns[tableName]?.map((column) => (
                        <ListItem
                          key={column.column_name}
                          secondaryAction={
                            <Tooltip title="Filtre Ekle">
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => handleFilterMenuOpen(e, tableName, column.column_name, column.data_type)}
                              >
                                <FilterListIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          }
                        >
                          <ListItemText
                            primary={
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => addColumnToQuery(tableName, column.column_name)}
                                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                              >
                                {column.column_name}
                              </Button>
                            }
                            secondary={column.data_type}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">
              {selectedConnection ? 'Tablolar yükleniyor...' : 'Lütfen bir bağlantı seçin'}
            </Typography>
          )}
        </Paper>

        {/* Filtre menüsü */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem onClick={handleAddFilter}>
            Filtre Koşulu Ekle
          </MenuItem>
        </Menu>
      </Grid>

      <Grid item xs={12} md={9}>
        {/* İleri düzey sorgu araçları */}
        <AdvancedQueryTools
          joins={joins}
          onJoinsChange={setJoins}
          tables={tables}
          tableColumns={tableColumns}
          fetchTableColumns={fetchTableColumns}
          updateQueryWithJoins={updateQueryWithJoins}
          // İleri seviye özellikleri için gerekli props'lar
          updateQueryWithGroupBy={updateQueryWithGroupBy}
          updateQueryWithOrderBy={updateQueryWithOrderBy}
          updateQueryWithFunctions={updateQueryWithFunctions}
          // GROUP BY için ekledik
          groupByColumns={groupByColumns}
          onGroupByChange={setGroupByColumns}
          // ORDER BY için ekledik
          orderByColumns={orderByColumns}
          onOrderByChange={setOrderByColumns}
          // Diğer state'ler
          functionExpressions={[]}
        />

        {/* Filtre koşulları */}
        {filterConditions.length > 0 && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Filtre Koşulları
            </Typography>

            {filterConditions.map(condition => (
              <FilterCondition
                key={condition.id}
                condition={condition}
                onChange={handleFilterChange}
                onRemove={handleFilterRemove}
                dataType={condition.dataType}
              />
            ))}
          </Paper>
        )}

        {/* Sorgu editörü */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Sorgu Çalıştır
          </Typography>

          <TextField
            label="SQL Sorgunuzu yazın"
            multiline
            rows={6}
            value={query}
            onChange={handleQueryChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            placeholder="SELECT * FROM tablo_adi"
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleRunQuery}
            disabled={isLoading || !query.trim() || !selectedConnection}
          >
            {isLoading ? 'Çalıştırılıyor...' : 'Sorguyu Çalıştır'}
          </Button>
        </Paper>

        {/* Sonuçlar */}
        {error && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fdeded' }}>
            <Typography color="error" variant="subtitle1">
              Hata: {error}
            </Typography>
          </Paper>
        )}

        {results && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sonuçlar
            </Typography>

            <Box sx={{ mb: 2 }}>
              <SyntaxHighlighter language="sql" style={materialDark}>
                {query}
              </SyntaxHighlighter>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {results.columns.map((column, index) => (
                      <TableCell key={index}>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {results.columns.map((column, colIndex) => (
                          <TableCell key={colIndex}>
                            {row[column] !== null ? row[column].toString() : 'NULL'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Sayfalama bileşeni */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={results.rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Sayfa başına satır:"
              labelDisplayedRows={
                ({ from, to, count }) => `${from}-${to} / ${count}`
              }
            />

            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {results.rows.length} satır döndürüldü
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default QueryPage;
