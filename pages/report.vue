<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col">
        <v-btn color="primary" @click="exportTable">Export to XLSX</v-btn>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <v-data-table
          id="repTable"
          disable-pagination
          hide-default-footer
          :loading="dataLoading"
          :items="reportRows"
          :headers="reportCols"
        />
      </div>
    </div>
  </div>
</template>
<script>
import * as XLSX from 'xlsx';
import S4WebServiceProxy from '@/S4WebServiceProxy.js';

export default {
  name: 'ConsumptionReport',
  data() {
    return {
      reportRows: [],
      reportCols: [
        {
          value: 'n1',
          text: 'Код счетчика',
        },
        { value: 'address', text: 'Адресная часть', field: 'address' },
        { value: 'room', text: 'Квартира', field: 'room' },
        {
          value: 'serialNumber',
          text: 'Номер счетчика',
          field: 'serialNumber',
          xlsFormat: 's',
        },
        {
          value: 'counterModel',
          text: 'Марка счетчика',
          field: 'counterModel',
        },
        { value: 'bookNumber', text: 'Номер книги', field: 'bookNumber' },
        { value: 'abonNumber', text: 'Номер абонента', field: 'abonNumber' },
        { value: 't1', text: 'T1', field: 't1', xlsFormat: 'n' },
        { value: 't2', text: 'T2', field: 't2', xlsFormat: 'n' },
        { value: 't3', text: 'T3', field: 't3', xlsFormat: 'n' },
        {
          value: 'date',
          text: 'Дата показаний',
          field: 'date',
          xlsFormat: 'd',
        },
      ],
      dataLoading: true,
    };
  },
  computed: {
    token() {
      return this.$store.getters.getToken;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const ws = new S4WebServiceProxy(this.token);
      this.dataLoading = true;
      const res = await ws.getReport();
      this.dataLoading = false;
      if (res.ok) {
        this.reportRows = res.data;
      } else if (res.status === 401) {
        // auth failure, e.g. token expired
        this.$store.dispatch('logout');
        this.$router.push('/login');
      } else {
        console.log(res.status + ' - ' + res.statusText);
      }

      for (const r of this.reportRows) {
        // round values for report
        if(r.t1) r.t1 = Math.ceil(r.t1); 
        if(r.t2) r.t2 = Math.ceil(r.t2); 
        if(r.t3) r.t3 = Math.ceil(r.t3); 
        if (r.date) r.date = new Date(r.date).toLocaleDateString();
        // const value not sure why it needed, but was in report template
        r.n1 = '1';
      }
    },
    exportTable() {
      // SheetJS
      const fName = 'Report ' + new Date().toLocaleString() + '.xlsx';

      const tblRoot = document.getElementById('repTable');
      const tbl = tblRoot.getElementsByTagName('table')[0];

      const ws = XLSX.utils.table_to_sheet(tbl, { raw: true });
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, fName);
    },
  },
};
</script>
